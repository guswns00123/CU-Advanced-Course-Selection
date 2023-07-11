const mysql = require('mysql2/promise');
const config = require('./config');

module.exports = {
// This function fetches the weekly schedule for a given user ID (sid).
// return course_code, option_code, option_name, day, start_time, end_time, and location for each course the user is enrolled in.
fetch_enrollcourse
    fetch_weekly: async function (id) {
        try {
            const connection = await mysql.createConnection(config);
            const sid = id
            const date = '2023-09-15'

            const query = `
                SELECT
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
                DATE(start_datetime) >= ? - INTERVAL (WEEKDAY(?)) DAY AND
                DATE(start_datetime) < ? + INTERVAL (6 - WEEKDAY(?)) DAY AND
                sid = ? AND
                User_Course_Status.status = 'Enrolled'
                GROUP BY
                course_code, option_code, option_name, start_datetime
                ORDER BY
                DAYOFWEEK(start_datetime), start_datetime
                ;
            `;

            // Execute the query and extract the result
            const [rows] = await connection.query(query, [date, date, date, date, sid]);
            return rows;
        } catch (error) {
            console.error(`weekly error: ${error}`);
            throw error;
        }
    },

    // This function fetches the available courses for a given user ID (sid) that they can see below their weekly schedule.
    // return course_code, option_code, option_name, day, start_time, end_time, location, and available seats for each course.
    fetch_enrollcourse: async function (id) {
        try {

            const date = '2023-09-15'
            const sid = id

            const connection = await mysql.createConnection(config);
            const query = `
            SELECT
            course_code,
            option_code,
            option_name,
            DAYNAME(start_datetime) AS day,
            TIME(start_datetime) AS start_time,
            TIME(end_datetime) AS end_time,
            room AS location,
            CONCAT(available_seats, '/', max_seats) AS seats
            FROM
            COURSE_INFORMATION.Course_Schedule
            LEFT JOIN COURSE_INFORMATION.Course_Information
            USING(course_code)
            LEFT JOIN
            COURSE_INFORMATION.Course_Status
            USING(course_code, option_code, option_name)
            WHERE
            DATE(start_datetime) >= ? - INTERVAL (WEEKDAY(?)) DAY AND
            DATE(start_datetime) < ? + INTERVAL (6 - WEEKDAY(?)) DAY AND
            course_code NOT IN (
                SELECT course_code
                FROM COURSE_INFORMATION.User_Course_Status
                LEFT JOIN COURSE_INFORMATION.User_Account USING(user_id)
                WHERE sid = ?) AND
            course_code NOT IN (
                SELECT course_code
                FROM COURSE_INFORMATION.Course_Status
                WHERE available_seats >= max_seats AND status != "Opened"
            )
            ORDER BY
            course_code, option_code, start_datetime;       
            `;

            const [rows] = await connection.query(query, [date, date, date, date, sid]);
            return rows;
        }
        catch (error) {
            console.error(`course_enroll error: ${error}`);
            throw error;
        }
    },
    
    // This function checks the validation for the selected courses for a given user ID (sid), course_code, option_code, and option_name.
    // return course_code, option_code, option_name, is_option_valid, and is_schedule_valid for each course.
    validation: async function (id, course_code, option_code, option_name) {
        const connection = await mysql.createConnection(config);

        const date = '2023-09-15'
        const sid = id;
        const courseCodes = course_code;
        const sections = option_code;
        const classTypes = option_name;

        try {
            for (let i = 0; i < courseCodes.length; i++) {
                const courseCode = courseCodes[i];
                const section = sections[i];
                const classType = classTypes[i];

                const query1 = `
                INSERT INTO COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST (sid, course_code, option_code, option_name)
                VALUES (${sid}, '${courseCode}', ${section}, '${classType}')`

                await connection.query(query1);

            }

            const query2 = `
            WITH RAW AS (
               SELECT * FROM COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST WHERE sid = ?
            ), ORIGINAL_OPTION_CT AS (
               SELECT course_code, option_code, COUNT(DISTINCT option_name) AS ct
               FROM COURSE_INFORMATION.Course_Schedule
               GROUP BY 1, 2
            ), GIVEN_OPTION_CT AS (
               SELECT course_code, option_code, COUNT(DISTINCT option_name) AS ct
               FROM RAW
               GROUP BY 1, 2
            ), COURSE_NUMBER_VALID AS (
               SELECT course_code, option_code, CASE WHEN oc.ct != gc.ct THEN 'invalid' ELSE 'valid' END AS is_optioin_valid
               FROM GIVEN_OPTION_CT gc
               INNER JOIN ORIGINAL_OPTION_CT oc
                   USING (course_code, option_code)
            ), WEEKLY_SCHEDULE AS (
               SELECT * FROM COURSE_INFORMATION.Course_Schedule
               INNER JOIN RAW tv
                   USING (course_code, option_code, option_name)
               WHERE DATE(start_datetime) >= 
               ? - INTERVAL (WEEKDAY(?)) DAY AND
               DATE(start_datetime) < ? + INTERVAL (6 - WEEKDAY(?)) DAY
            ), COURSE_SCHEDULE_VALID AS (
               SELECT
                   cs.course_code,
                   cs.option_code,
                   cs.option_name,
                   CASE
                       WHEN EXISTS (
                           SELECT 1
                           FROM WEEKLY_SCHEDULE cs2
                           WHERE (cs2.course_code <> cs.course_code
                               OR cs2.option_code <> cs.option_code
                               OR cs2.option_name <> cs.option_name)
                               AND ((cs2.start_datetime >= cs.start_datetime AND cs2.start_datetime < cs.end_datetime)
                                   OR (cs2.end_datetime > cs.start_datetime AND cs2.end_datetime <= cs.end_datetime))
                       ) THEN 'invalid'
                       ELSE 'valid'
                   END AS is_schedule_valid
               FROM WEEKLY_SCHEDULE cs
            )
            SELECT
               course_code, option_code, option_name, is_optioin_valid, is_schedule_valid
            FROM COURSE_SCHEDULE_VALID
            INNER JOIN COURSE_NUMBER_VALID USING(course_code, option_code)
            ;`

            const [rows2] = await connection.query(query2, [sid, date, date, date, date]);

            return rows2;
        }

        catch (error) {
            console.error(`vaildation error: ${error}`);
            throw error;
        }
    },
    // This function deletes all records from the COURSE_REGISTRATION_REQEUST table for a given user ID (sid).
    invalid: async function (id) {
        const connection = await mysql.createConnection(config);

        query1 = `DELETE FROM COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST WHERE sid = ${id}`

        await connection.query(query1);

    },
    
    // This function enrolls the user in the selected courses by updating the available seats in
    // the Course_Status table, deleting the user's current courses from the User_Course_Status table, inserting the new courses into the User_Course_Status table,
    // and finally deleting the records from the COURSE_REGISTRATION_REQEUST table for the given user ID (sid).

    enroll: async function (id) {
        const sid = id
        const connection = await mysql.createConnection(config);

        query1 = `WITH SEATS AS (
                SELECT course_code,
                        option_code,
                        CASE
                            WHEN SUM(src) = 0 THEN 0
                            WHEN SUM(src) = 1 THEN 1
                            WHEN SUM(src) = -1 THEN -1
                            END AS val
                FROM (
                            SELECT course_code, option_code, 0 AS src
                            FROM COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST
                            WHERE sid = ${sid}
                            UNION ALL
                            SELECT course_code, option_code, -1 AS src
                            FROM COURSE_INFORMATION.User_Course_Status LEFT JOIN COURSE_INFORMATION.User_Account USING (user_id)
                            WHERE sid = ${sid}
                        ) AS combined
                GROUP BY 1, 2
                ORDER BY 1, 2
                )
                UPDATE
                COURSE_INFORMATION.Course_Status
                SET
                available_seats = available_seats + (
                SELECT val
                FROM SEATS
                WHERE
                    Course_Status.course_code = SEATS.course_code AND
                    Course_Status.option_code = SEATS.option_code
                )
                WHERE
                (course_code, option_code) IN (
                SELECT course_code, option_code
                FROM SEATS
                );`

        query2 = `DELETE COURSE_INFORMATION.User_Course_Status FROM COURSE_INFORMATION.User_Course_Status
        LEFT JOIN COURSE_INFORMATION.User_Account USING(user_id)
        WHERE sid = ${sid};`

        query3 = `INSERT INTO COURSE_INFORMATION.User_Course_Status (user_id, course_code, option_code, status, grade)
        SELECT DISTINCT user_id, course_code, option_code, 'Enrolled', NULL
        FROM COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST LEFT JOIN COURSE_INFORMATION.User_Account USING(sid)
        WHERE sid = ${sid};`

        query4 = `DELETE FROM COURSE_INFORMATION.COURSE_REGISTRATION_REQEUST WHERE sid = ${sid};`

        await connection.query(query1);
        await connection.query(query2);
        await connection.query(query3);
        await connection.query(query4);

    }
}
