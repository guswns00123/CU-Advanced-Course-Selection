const fs = require('fs');
const mysql = require('mysql2/promise');

const config = require('./config');

module.exports = {
    // Function takes a query string as input and executes it using a MySQL connection.
    // It returns the result of the query as an array of objects. The connection is closed after the query execution.
    fetch: async function(query) {
        try {
            const connection = await mysql.createConnection(config);

            const result = await connection.query(query);
            await connection.end();
            return result[0];
        } catch (error) {
            console.error(`Connection error: ${error}`);
            throw error;
        }
    },
    
    // This function takes a query string as input and executes it using a MySQL connection to insert data into the database.
    // The connection is committed and closed after the query execution.
    insert: async function(query) {
        try {
            const connection = await mysql.createConnection(config);

            await connection.query(query);
            await connection.commit();
            await connection.end();
            return;
        } catch (error) {
            console.error(`Connection error: ${error}`);
            throw error;
        }
    },
    
    // This function takes a user ID (id) as input and deletes the user's data from various tables in the database (Course_Registration, User_Course_Status, User_Profile, and User_Account).
    // It uses a MySQL connection to execute each delete query, commits the changes, and then closes the connection.
    deleteUser: async function(id) {
        try {
            const connection = await mysql.createConnection(config);

            const deleteQueries = [
                `DELETE FROM COURSE_INFORMATION.Course_Registration WHERE user_id = ${id}`,
                `DELETE FROM COURSE_INFORMATION.User_Course_Status WHERE user_id = ${id}`,
                `DELETE FROM COURSE_INFORMATION.User_Profile WHERE user_id = ${id}`,
                `DELETE FROM COURSE_INFORMATION.User_Account WHERE user_id = ${id}`
            ];

            for (const query of deleteQueries) {
                await connection.query(query);
            }

            await connection.commit();
            await connection.end();

            console.log('Delete operation completed.');
        } catch (error) {
            console.error(`Connection error: ${error}`);
            throw error;
        }
    }
}
