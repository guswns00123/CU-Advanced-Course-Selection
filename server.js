// import libraries and modules
const express = require('express')
const path = require('path');
const auth = require('./backend/auth');
const admin = require('./backend/admin');
const main = require('./backend/main');
const course_info = require('./backend/course_info');
const profile = require('./backend/profile');
const bodyParser = require('body-parser');
const course_manage = require('./backend/course_manage');

// basic configuration
const app = express()
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
var cors = require('cors');
app.use(cors());





app.post('/verify', async function (req, res) {
//   receive ID & password through post 
//   input format
//   {ID: userID
//     Password: password
//   }
  let data = req.body;
//   check for user validity success = true failure = false
  user_validity = await auth.verify_user_login(data['ID'],data['Password']);
//   check for admin validiy success = true failure = false
  admin_validity = await auth.verify_admin_login(data['ID'],data['Password']);
//output format
//json {"user":boolean,"admin":boolean}
// user login success case
    if (user_validity==true){
      res.send({"user":true,"admin":false})
    }
    // admin login success case
    else if (admin_validity==true){
      res.send({"user":false,"admin":true})
    }
    // both failed case or error case
    else{
      res.send({"user":false,"admin":false})
    }
})


app.post('/signup', async function (req, res) {
// sign up 
// input format // sign_up_info = {}
// sign_up_info['ID'] =  "userin3"
// sign_up_info['name'] =  "kjh"
// sign_up_info['passwd'] = "123456"
// sign_up_info['repasswd'] = "123456"
// sign_up_info['email'] = "123@link.cuhk.edu.hk"
// sign_up_info['major'] = 'Computer Science'
// sign_up_info['year'] = "2017"

  try{
  let data = req.body;
  user_validity = await auth.signup(data);
//return format
//[boolean, 'message string']
// output true of false depending on the signup validity with reason message
  res.send(user_validity)
  }
  // catch undefined error
  catch{
   res.send([false,"Invalid input"])
  }

})

// admin login page get method
app.get('/admin', async function (req, res) {
//fecth all users and courses list
  courses = await admin.fetch_courses();
  users = await admin.fetch_users();
//output format
  res.send({"course": courses,"user":users})
})

//user or course deletion page
// input format {'flag': user or course, 'data': user name or course code(CSCI3180)}

app.post('/admin/edit', async function (req, res) {
  let data = req.body;
// send user name course code for deletion to the module
  try{
    if (data['flag'] == 'user'){
      f = await admin.delete_users(data['data'])
    }
    if (data['flag'] == 'course'){
      f = await admin.delete_courses(data['data'])
    }
    return res.send({'flag':f})
  }
// catch the error
  catch {
    return res.send({'flag':false})
  }
  // output successful return true failed return false
})

// user login -> main page case 
//intput format {'user':sid} with post method
app.post('/main', async function (req, res) {
  let data = req.body;
  id = data['data']
// output format eg
//{"courses":[{"schedule_id":130,"course_code":"A","option_code":3,"option_name":"LEC","start_datetime":"2022-12-31T17:01:01.000Z","end_datetime":"2022-12-31T17:01:01.000Z","room":"ROOM1","instructor":"TEST","course_id":105,"course_name":"A","prerequisite":"A","room_number":"A","professor":"A","schedule":"2023-01-01 01:01:01","units":3}]}
  res.send(await main.fetch_enrolled_course(id))
})

// CourseInfoPage access case -> return all avaiable courses in list format
app.get('/CourseInfoPage', async function (req, res) {
  let data = req.body;
  res.send(await course_info.fetch_all())
})
//CourseInfoPage's more details button action
// post method with course code
// input format {data:course_code}
app.post('/CourseInfoPage/CoursePop', async function (req, res) {
  let data = req.body;
  var id = data['data'];
  res.send(await course_info.get_course_info(id))
 // courseid's course review status information return in form of list
 //e.g
 //[{"course_id":105,"course_code":"A","course_name":"A","prerequisite":"A","room_number":"A","professor":"A","schedule":"2023-01-01 01:01:01","units":3,"status_id":5,"option_code":3,"option_name":"LEC","available_seats":1,"max_seats":1,"status":"TEST","review_id":4,"user_id":10,"rating":5,"review_text":"test"}]
})

// Course profile page for showing enrolled courses and user data
// input format {data:sid}
app.post('/ProfilePage', async function (req, res) {
  sid = req.body['data']
// fetch user info and enrolled course info
  try{
    var user_info = (await profile.fetch_user_info(sid))[0]
    var course_info = await profile.fetch_course_info(sid)
    res.send({'user':user_info,"course":course_info})
  }
// error situation
  catch{
    return 
  }
// output format
//{user:user_info_dict,course:[course_list]}
})


// Course Management Page for showing schedules and courses that can enrolled by users
app.post('/CourseManage', async function (req, res) {
  sid = req.body['data']

    try {
      var weekly_info = await course_manage.fetch_weekly(sid)
      var course_info = await course_manage.fetch_enrollcourse(sid)

    // error situation
    } catch (error) {
      console.error(`Connection error: ${error}`);
      throw error;
  }

  res.send({'week':weekly_info, 'course':course_info})

})

// Check validations for selected enrollment courses
app.post('/Validation', async function (req, res) {
  sid = req.body['sid']
  course_code = req.body['course_code']
  option_code = req.body['option_code']
  option_name = req.body['option_name']

  try {
    let validate = await course_manage.validation(sid, course_code, option_code, option_name)

    res.send(validate)
    
  // error situation
  } catch (error) {
    console.error(`Connection error: ${error}`);
    throw error;
  }
})

// situation when selected courses are invalid
app.post('/Validation/invalid', async (req, res) => {
  const { sid } = req.body;
  await course_manage.invalid(sid); // Call the invalid function with the sid value
  res.send('Done');
});

// enroll functions
app.post('/Validation/enroll', async function (req, res) {
  sid = req.body['sid']
  try {
    let enroll = await course_manage.enroll(sid)
    res.send(enroll)
  } catch (error) {
    console.error(`enroll error: ${error}`);
    throw error;
  }

})

// when user redirects to mainpage
app.post('/MainPage', async function (req, res) {
  sid = req.body['data']
// send enrolled course data of a certain sid(user), too 
  res.send(await course_manage.fetch_weekly(sid))
})

// listening on port 3005
app.listen(3005, () => {
  console.log('Server is running on port 3005')
})
