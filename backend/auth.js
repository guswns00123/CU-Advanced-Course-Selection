// module access the db server and edit data in db
const sql = require('./sql');
module.exports = {
    // module for checking user login validity
    verify_user_login: async function(id,passwd) {
        // query get user_id whether exists in db
        query = `SELECT * FROM COURSE_INFORMATION.User_Account WHERE sid = '${id}'`
        
        try{
        const d = await sql.fetch(query)
        // does not exist retun false
        if (d.length == 0)
        {   
            return false
        }
        // exists and password matches return true
        for (const x of d) { 
            if (x["password"]==passwd){
                return true
            }
        }
        }
        // unexpected case (password does not match)return false
        catch{
            return false
        }
    },
    // module for checking admin login validity
    verify_admin_login: async function(id,passwd) {
        // query get user_id whether exists in db
        query = `SELECT * FROM COURSE_INFORMATION.Admin_Account WHERE username = '${id}'`
        try{
            const d = await sql.fetch(query)
            // does not exist retun false
            if (d.length == 0)
            {   
                return false
            }
            // exists and password matches return true
            for (const x of d) { 
                if (x["password"]==passwd){
                    return true
                }
            }
        }
        // unexpected case (password does not match)return false
        catch{
            return false
        }
    },
    signup: async function(sign_up_info){
        // module for sign up
        try{
            // extract data from frontend
            userID= sign_up_info['ID']
            username = sign_up_info['name']
            passwd=sign_up_info['passwd']
            repasswd=sign_up_info['repasswd']
            email= sign_up_info['email']
            major = sign_up_info['major']
            year = sign_up_info['year']
            stream = sign_up_info['stream']
            // case 1 password and repeated password does not match
            if (passwd != repasswd){
                return [false, "Passwords are not the same"]
            }
            // query for checking the user id exists or not
            query = `WITH USER_X_ADMIN AS (
                SELECT 'user' AS category, sid FROM COURSE_INFORMATION.User_Account
                UNION ALL
                SELECT 'admin' AS category, username FROM COURSE_INFORMATION.Admin_Account
               )
               SELECT
                COALESCE(category, 'new user') AS category
               FROM
                USER_X_ADMIN
               WHERE
                sid = '${userID}'
               ;
            `  
            const d = await sql.fetch(query)
            // case 2 existing user
            if (d.length != 0)
            {   
                return [false, "Existing user"]
            }
            // case 3 email is not cuhk email
            const email_regex = new RegExp(".*@link.cuhk.edu.hk");
            if (email_regex.test(email)== false){
                return [false, "Invalid email input"]
            }
            // case 4 email and user_id is not matching 
            const sid_reg = new RegExp("[^@]+");
            email_sid = email.match(sid_reg)[0];
            if (userID!==email_sid)
            {
                return [false, "SID does not match"]
            }
            // // Success signup 
            // // update user_account db
            insert_query=`INSERT INTO COURSE_INFORMATION.User_Account (user_id, password, sid) VALUES (NULL,"${passwd}","${userID}")`
            // //uncomment in actual implementation
            await sql.insert(insert_query)
            query = `SELECT user_id FROM COURSE_INFORMATION.User_Account where sid =  "${userID}" `
            // get user_id of user account
            const d2 = await sql.fetch(query)
            const recent_id = d2[0]['user_id']
            //update user profile query
            const currentYear = new Date().getFullYear();
            var current_year = parseInt(currentYear)-year
            insert_query=`INSERT INTO COURSE_INFORMATION.User_Profile (user_id, sid, name, personal_email, department, major, stream, study_year, admission_year)
            VALUES (
            ${recent_id},
             "${userID}",
             "${username}",
             "${email}",
             "NULL",
             "${major}",
             "${stream}",
             
            "${current_year}",
             "${year}"
            );
            `
            await sql.insert(insert_query)
            return[true,"Sign up sucess!!"]

        } 
        // unexpected error case
        catch{
            return [false, 'Invalid input']
        }
    }
 }
