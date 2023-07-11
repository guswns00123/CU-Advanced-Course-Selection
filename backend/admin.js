// add modules
const { query } = require('express');
// module access the db server and edit data in db
const sql = require('./sql');

module.exports = {
    // module for fetching all courses
    fetch_courses: async function() {
    // fetching all courses query
        try{
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
                course_code;`
            // fetch and return the result in list form
            const d = await sql.fetch(query)
            return d
        }
        // error case
        catch{
            return []
        }
    },
    // module for feaching all users
    fetch_users: async function() {
        // query for feaching all users
        var query = `SELECT sid, name, major, study_year FROM COURSE_INFORMATION.User_Profile ORDER BY sid;`
        try{
            // fetch and return the result in list form
            const d = await sql.fetch(query)
            return d
        }
         // error case
        catch{
            return []
        }
    },
    // module for delete a certain user
    delete_users: async function(id) {
        var query = `SELECT user_id FROM COURSE_INFORMATION.User_Account where sid = "${id}"`
        try{
            const d = (await sql.fetch(query))[0]["user_id"]
            d1 = `Delete from COURSE_INFORMATION.User_Profile where user_id=${d}`
            d2 = `Delete from COURSE_INFORMATION.User_Account where user_id=${d}`
            await sql.insert(d1)
            await sql.insert(d2)
            return true
        }
        catch{
            return false
        }
        
    },
   // module for delete a certain course
    delete_courses: async function(id) {
        try {
            // query for delete a certain course
            var query =
            `DELETE COURSE_INFORMATION.Course_Status, COURSE_INFORMATION.Course_Schedule, COURSE_INFORMATION.User_Course_Status, COURSE_INFORMATION.Course_Information FROM COURSE_INFORMATION.Course_Information
            LEFT JOIN COURSE_INFORMATION.Course_Status ON COURSE_INFORMATION.Course_Information.course_code = COURSE_INFORMATION.Course_Status.course_code
            LEFT JOIN COURSE_INFORMATION.Course_Schedule ON Course_Information.course_code = COURSE_INFORMATION.Course_Schedule.course_code
            LEFT JOIN COURSE_INFORMATION.User_Course_Status ON Course_Information.course_code = COURSE_INFORMATION.User_Course_Status.course_code
            WHERE COURSE_INFORMATION.Course_Information.course_code in ("${id}");`
            await sql.insert(query)
            // success return true
            return true
        }
        // failed return false
        catch {
            return false
        }
    },

}
