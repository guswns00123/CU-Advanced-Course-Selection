const { query } = require('express');
const sql = require('./sql');

// Fetches user information including name, major, email, study year, and GPA, as well as the course schedule for the user based on their student ID (sid) and the specified week.
module.exports = {fetch_user_info: async function(sid) {
   var query = `SELECT
   name,
   sid,
   major,
   admission_year,
   CONCAT(sid, '@link.cuhk.edu.hk') AS email,
   study_year,
   stream,
   IFNULL(ROUND(AVG(grade), 2),'No Course Taken') AS GPA
 FROM
 COURSE_INFORMATION.User_Profile
 INNER JOIN
 COURSE_INFORMATION.User_Account
  USING(user_id, sid)
 LEFT JOIN
 COURSE_INFORMATION.User_Course_Status
   USING(user_id)
 WHERE
  sid = "${sid}"
 ;`
 var user_info =  await sql.fetch(query);
return user_info
},
fetch_course_info: async function(sid) {
    var query = 
`SELECT
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
DATE(start_datetime) >= "2023-09-09" - INTERVAL (WEEKDAY("2023-09-09")) DAY AND
DATE(start_datetime) < "2023-09-09" + INTERVAL (6 - WEEKDAY("2023-09-09")) DAY AND
sid = ${sid}
GROUP BY
course_code, option_code, option_name, start_datetime
ORDER BY
DAYOFWEEK(start_datetime), start_datetime;`
let course_info =  await sql.fetch(query);
return course_info


},

}
