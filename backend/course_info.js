// module access the db server and edit data in db
const sql = require('./sql');
module.exports = {
    // module for fetching all courses
    fetch_all: async function() {
    // query for fetching all courses
       var query = `SELECT course_code, course_name, units,
        CASE
            WHEN COUNT(DISTINCT stream) > 1 THEN 'Multiple Streams'
            ELSE MAX(stream)
            END AS stream
        FROM
            COURSE_INFORMATION.Course_Information
        INNER JOIN
            COURSE_INFORMATION.Department_Requirement
        USING(course_code)
        GROUP BY
            course_code, course_name, units
        ORDER BY
            course_code;;`
        const d = await sql.fetch(query)
        // return course list in list form
        return d
    },
    // module for fetching specific course data
    get_course_info: async function(id) {
        // receive course_id from frontend
        id = id['data']
        // query for fetching specific course data
        var query = `SELECT ci.course_code, ci.course_name, ci.course_description, ci.units, ci.course_level, ci.semester, ci.grading_basis,
        IFNULL(GROUP_CONCAT(DISTINCT ic.instructor SEPARATOR ', '),'Unknown') AS instructors
        FROM
            COURSE_INFORMATION.Course_Information ci
        LEFT JOIN
            COURSE_INFORMATION.Course_Schedule ic
            USING(course_code)
        WHERE
            ci.course_code = "${id}"
        GROUP BY
            1,2,3,4,5,6,7
        ORDER BY
            1
        ;`
        // receive the data from db
        const data1 = await sql.fetch(query)
        // query for fetching specific course review data
        var review_query = `SELECT course_code, rating, review_text FROM COURSE_INFORMATION.Course_Review
        WHERE course_code = '${id}'`
         // receive the data from db
        const data2 = await sql.fetch(review_query)
        // return data in {info:course_data,:review:review_data}
        return {"info":data1,"review":data2}
    }
}
