const sql = require('./sql');

module.exports = {
    // This module fetches the enrolled courses for a specific user and returns the course schedule along with a list of recommended courses based on user's department and stream.
    // If no recommendations are found, it returns random courses.
    fetch_enrolled_course: async function(id) {
        try{
            var query = `SELECT
            DISTINCT course_code, option_code, option_name,
            DAYNAME(start_datetime) AS day,
            TIME(start_datetime) AS start_time,
            TIME(MIN(end_datetime)) AS end_time,
            room AS location
            FROM
            COURSE_INFORMATION.Course_Schedule
            LEFT JOIN
            COURSE_INFORMATION.Course_Information
                USING(course_code)
            INNER JOIN
            COURSE_INFORMATION.User_Course_Status
                USING(course_code, option_code)
            INNER JOIN
            COURSE_INFORMATION.User_Account
                USING(user_id)
            WHERE
            DATE(start_datetime) >= '2023-09-15' - INTERVAL (WEEKDAY('2023-09-15')) DAY AND
            DATE(start_datetime) < '2023-09-15' + INTERVAL (6 - WEEKDAY('2023-09-15')) DAY AND
            sid = "${id}" AND
            COURSE_INFORMATION.User_Course_Status.status = 'Enrolled'
            GROUP BY
            course_code, option_code, option_name, start_datetime
            ORDER BY
            DAYOFWEEK(start_datetime), start_datetime
            ;`
            const data = (await sql.fetch(query))

            var recommend_q = `WITH CURR_DEP AS (
                SELECT department, stream
                FROM COURSE_INFORMATION.Department_Requirement
                INNER JOIN
                COURSE_INFORMATION.User_Profile
                    USING(department, stream)
                WHERE COURSE_INFORMATION.User_Profile.sid = ${id}
              ), USER_HISTORY AS (
                SELECT course_code
                FROM COURSE_INFORMATION.User_Course_Status
                LEFT JOIN COURSE_INFORMATION.User_Account USING(user_id)
                WHERE sid = ${id}
              )
              SELECT course_code, course_name, ROUND(AVG(rating), 1) AS rating
              FROM COURSE_INFORMATION.Course_Review
              LEFT JOIN COURSE_INFORMATION.Course_Information USING(course_code)
              LEFT JOIN COURSE_INFORMATION.Department_Requirement USING(course_code)
              INNER JOIN CURR_DEP USING(department, stream)
              WHERE
                  course_code NOT IN (SELECT course_code FROM USER_HISTORY)
              GROUP BY 1
              ORDER BY 3 DESC
              LIMIT 4
             `
            var recommended = (await sql.fetch(recommend_q))
            if (recommended.length === 0){
                var query2 = `(select * from COURSE_INFORMATION.Course_Information ci inner join COURSE_INFORMATION.Course_Review cr on ci.course_code = cr.course_code) order by RAND() limit 4 `
                recommended = (await sql.fetch(query2))
            }

            return ({"courses":data,"recommend":recommended})

        }
        
        catch{
            return ({"courses":[],'recommend':[]})
        }
    }
}
