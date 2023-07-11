import './MainPage.css';
import './course-management.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import search_icon from './image/search.ico';
import cu_logo from './image/image-2-bg.png';
import axios from 'axios'

function CourseManage() {
  const { state } = useLocation();
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState([
  ]);

  const [schedules, setschedule] = useState([]);

  // fetch weekly courses from the amazon aws
  useEffect(() => {
    axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/CourseManage', {
      data: state,
    })
      .then(function (response) {

        setCourse(response.data['course']);
        setschedule(response.data['week']);
        console.log(response.data['week'][2]);
      })
      .catch(function (error) {
        console.log(error);
      });

  }, []);

  // html block for displaying weekly course schedule
  function Schedule({ schedule, onRemove }) {
    return (
      <div class="hader-JYY">
        <p class="course-name-TRS">{schedule.course_code}</p>
        <p class="course-name-TRS">{schedule.option_code}</p>
        <p class="course-name-TRS">{schedule.option_name}</p>
        <p class="date-NYQ">{schedule.day.substring(0, 3)}</p>
        <p class="start-time-HvG">{schedule.start_time.substring(0, 5)}</p>
        <p class="end-time-Qzt">{schedule.end_time.substring(0, 5)}</p>
        <p class="location-LtY">{schedule.location}</p>
        <p class="location-hh">{schedule.enrolled !== undefined ? schedule.enrolled : 'Yes'}</p>
        <button class="vector-GGQ" onClick={() => onRemove(schedule.course_code, schedule.option_name, schedule.start_time, schedule.end_time)}>Delete</button>
      </div>
    )
  }

  // map list of courses schedule 
  function ScheduleList({ schedules, onRemove }) {
    return (
      <div>
        {schedules.map(schedule => (
          <Schedule schedule={schedule} key={schedule.course_code} onRemove={onRemove} />
        ))}
      </div>
    )
  }

  // Remove course from Weekly Schedule
  const onRemove = (course_code, option_name, start_time, end_time) => {
    setschedule(schedules.filter(schedules => schedules.course_code != course_code || schedules.option_name != option_name || schedules.start_time != start_time || schedules.end_time != end_time));
  }

  // html block for displaying courses 
  function Card(props) {
    const { course_code, option_code, option_name, day, start_time, end_time, location, seats } = props;
    return (
      <div class="hader-TSY">
        <p class="course-code-bYk">{course_code}</p>
        <p class="course-name-82t">{option_code}</p>
        <p class="units-T5A">{option_name}</p>
        <p class="grade-BWx">{day.substring(0, 3)}</p>
        <p class="done-K7N">{start_time.substring(0, 5)} </p>
        <p class="vector-44x">{end_time.substring(0, 5)}</p>
        <p class="open-seats-5-of-100-vN4">{location}</p>
        <p class="open-seats-5-of-100-vNN">{seats}</p>
        <button onClick={onCreate} value={[course_code, option_code, option_name, day, start_time, end_time, location, seats]}>add</button>
      </div>
    )
  }

  // map list of courses 
  function CardList({ data }) {
    return (
      <div>
        {data.map((course) => (
          <Card key={course.id} {...course} />
        ))}
      </div>
    )
  }

  // function to check overlapping course in selected course, compared to the exisiting scheduled courses
  function hasOverlap(schedule_list, course_tocheck) {
    for (let i = 0; i < schedule_list.length; i++) {
      const course = schedule_list[i];

      if (course.course_code === course_tocheck.course_code && course.option_code === course_tocheck.option_code && course.option_name === course_tocheck.option_name) {
        return true;
      }
    }
    return false;
  }

  //For filtering course list
  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase())
  };
  const filterCourse = course.filter((course1) => {
    return course1.option_name.toLowerCase().includes(search.toLowerCase()) || course1.course_code.toLowerCase().includes(search.toLowerCase());
  })

  const onCreate = (e) => {
    const list1 = e.target.value.split(",");

    // adjust data for comparison
    const newSchedule = {
      course_code: list1[0],
      option_code: list1[1],
      option_name: list1[2],
      day: list1[3],
      start_time: list1[4],
      end_time: list1[5],
      location: list1[6],
      enrolled: "No"
    }

    // check if selected courses overlap with the schedule
    if (hasOverlap(schedules, newSchedule)) {
      console.log("overlapping");
    } else {
      setschedule([...schedules, newSchedule]);
      console.log("added");
    }



  }

  // Apply the change on adding new courses to the schedule
  const onApply = (schedules) => {
    const response = window.confirm("Do you want to apply the changes??");
    if (response) {
      // send added schedule for verification, where more detailed verifications are done in the back-end side
      const course_code_list = [];
      const option_code_list = [];
      const option_name_list = [];

      // prepare data to be sent to the back-end side
      for (let i = 0; i < schedules.length; i++) {
        course_code_list.push(schedules[i].course_code);
        option_code_list.push(String(schedules[i].option_code));
        option_name_list.push(schedules[i].option_name);
      }

      // send the data
      axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/Validation', {
        sid: state,
        course_code: course_code_list,
        option_code: option_code_list,
        option_name: option_name_list,
      }).then(function (response) {

        console.log(response.data);
        const invalid_items = [];

        // check whether returned value from the back-end claims that courses thats planned to be added are valid or not 
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].is_optioin_valid == "invalid" || response.data[i].is_schedule_valid == "invalid") {
            invalid_items.push(response.data[i].course_code);
          }
        }


        let invalid_codes = invalid_items.toString();
        console.log(invalid_codes);

        // if valid, send signal to make a change. If not, cancel the request
        if (invalid_items.length == 0) {
          alert("Changed successfully!");
          axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/Validation/enroll', {
            sid: state,
          });
          window.location.reload();
        } else {
          alert("These items are not valid: " + invalid_codes);
          axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/Validation/invalid', {
            sid: state,
          });
        }

      })
        .catch(function (error) {
          console.log(error.data);
          alert("Failed");
          window.location.reload();
        });

    } else {
      alert("cancelled");
      window.location.reload();
    }

  }
  // return html + CSS front-end design for course management page
  return (
    <div class="course-management-MWG main-page-LCg">
      <div class="main-page-LCg">
        {/* Left-side Drawer for navigation */}
        <div class="left-bar-TYC">
          <div class="rectangle-38-z2L">
          </div>
          <div class="log-out-7se">
            <a class="log-out-kQp" href="/">Log out</a>
          </div>
          <div class="my-profile-YDW">
            <div class="group-1-rzt">
              <Link class="my-profile-Jrt" to='/ProfilePage' state={state}>My profile</Link>
            </div>
            <div class="group-1-rzt">
              <Link class="my-profile-Jrt" to='/MainPage' state={state}>Main Page</Link>
            </div>
            <div class="group-1-rzt">
              <Link class="my-profile-Jrt" to='/CourseInfoPage' state={state}>Course Information</Link>
            </div>
            <div class="group-1-rzt">
              <Link class="my-profile-Jrt " style={{ backgroundColor: "#BA7FD4" }} to='/CourseManage' state={state}>Course Management</Link>
            </div>
          </div>
          <p class="cuhk-course-RwW" >CUHK Course</p>
          <Link className="image-3-wQ4" to='/MainPage' state={state}><img style={{ width: "100%", height: "100%" }} src={cu_logo}></img></Link>
        </div>
        <div class="auto-group-lbgx-3yz">
          <p class="course-management-oCU">Course Management</p>
          <div class="weekly-schedule-KRi">
            <div class="rectangle-387-U3i"></div>
            {/* weekly schedule table headers */}
            <div class="group-477-EeL">
              <p class="weekly-schedule-Ant">Weekly schedule</p>
              <div class="hader-i3i">
                <p class="course-name-TGC">Course Code</p>
                <p class="course-name-TGC">Option Code</p>
                <p class="course-name-TGC">Option Name</p>
                <p class="date-o5A">Day</p>
                <p class="start-time-Y2k">Start time</p>
                <p class="end-time-g8x">End time</p>
                <p class="location-Deg">Location</p>
                <p class="status-drop-Mkt">enrolled</p>
                <button class="status-drop-Mkt" onClick={() => onApply(schedules)}>Apply</button>
              </div>
            </div>
            <div class="schedule-list-obn" style={{ overflow: "auto" }}>
              <ScheduleList schedules={schedules} onRemove={onRemove} />
            </div>
          </div>
          <div class="course-search-for-add-hJx" >
            <div class="rectangle-386-eEC" ></div>
            <div class="all-courses-Zc4" style={{ overflow: "auto" }}>
              <CardList key={course.id} data={filterCourse} />
            </div>
            <div class="group-478-Sr4">
              <div class="frame-455-An4">
                <div class="courses-h1J">Courses</div>
                <div class="search-box-J9W">
                  <div class="group-407-DXN">
                    <img style={{ width: "100%", height: "100%", marginRight: "2rem" }} src={search_icon}></img>
                    <input type='text' className="search-Vzg" maxLength='20' placeholder='Search Course Here'
                      onChange={handleChange} />
                  </div>
                </div>
              </div>
              {/* Available courses table header */}
              <div class="hader-D9z">
                <p class="course-code-YTA">Course Code</p>
                <p class="course-name-H9r">Option Code</p>
                <p class="units-QEU">Option Name</p>
                <p class="grade-9C4">Day</p>
                <p class="status-V12">Start time</p>
                <p class="seats-poz">End time</p>
                <p class="seats-poz">Location</p>
                <p class="add-NKi">Seats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CourseManage;
