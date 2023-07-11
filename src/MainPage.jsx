import './MainPage.css';
import './course-management.css';
import React, { useState, useEffect } from 'react';
import cu_logo from './image/image-2-bg.png';
import cu_img from './image/image-4.png';
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from 'axios'

function MaingePage() {
    const { state } = useLocation();
    // Schedule Data 
    // Course_Schedule(schedule_id, course_code, option_code, option_name, start_datetime, end_datetime, room, instructor)
    const [schedules, setschedule] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [sid, setSid] = useState([]);

    // fetch courses for the timetable and recommended courses from amazon aws
    useEffect(() => {
        console.log("메인페이지실행");
        console.log(state);
        setSid(state);
        axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/Main', {
            data: state,
        })
            .then(function (response) {
                console.log(response.data);

                setschedule(response.data["courses"]);
                setRecommend(response.data["recommend"]);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);
    const time_table = [];

    // filling time table with empty space, with different colour weekend 
    for (let i = 0; i < 120; i++) {
        if ((i + 1) % 6 == 0) {
            time_table.push(<div id={i} class="weekend"></div>)
        } else {
            time_table.push(<div id={i} ></div>)
        }

    }

    // replacing time table with existing courses
    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const result = date_to_block(schedule);
        let block_num = result.block_num;
        let n_hours = result.n_hours;

        // different timetable block size for courses with more than 1h
        if (n_hours == 1) {
            time_table[block_num] =
                <div>
                    <div class="accent-green-gradient">
                        <p>{schedule.course_code}</p>
                        <hr></hr>
                        <p>{schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}</p>
                        <p>{schedule.location}</p>
                    </div>
                </div>

        } else {
            time_table[block_num] =
                <div >
                    <div class="accent-green-gradient-two">
                        <p style={{ height: "1.4rem" }}>&nbsp;</p>
                        <p>{schedule.course_code}</p>
                        <hr></hr>
                        <p>{schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}</p>
                        <p>{schedule.location}</p>
                    </div>
                </div>

        }
    }

    // convert date into certain number and hours to fit into the timetable more conveniently 
    function date_to_block(schedule) {
        // string to time
        // schedule -> time block from 0 to 59
        let hours_start = parseInt(schedule.start_time);
        let hours_end = parseInt(schedule.end_time);
        let date_to_num = 0;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const foo = schedule.day;

        switch (foo) {
            case "Monday":
                date_to_num = 0;
                break;
            case "Tuesday":
                date_to_num = 1;
                break;
            case "Wednesday":
                date_to_num = 2;
                break;
            case "Thursday":
                date_to_num = 3;
                break;
            case "Friday":
                date_to_num = 4;
                break;
            case "Saturday":
                date_to_num = 5;
                break;

        }
        let n_hours = hours_end - hours_start;
        return { block_num: (hours_start - 8) * 6 * 2 + date_to_num, n_hours: n_hours };

    }

    // data form in html to be displayed 
    function Schedule({ schedule }) {
        return (
            <Link class="auto-group-sq1h-iy6 " to='./CoursePop' state={{ data: [schedule.course_code, sid] }}>
                <div class="melanie-grutt-V28">
                    <div class="group-461-QPz">
                        <p class="engg2100-Mq2">{schedule.course_code}</p>
                        <p class="software-engineering-t4G">{schedule.course_name}</p>
                        <p class="rating-2-bUU">Rating: {schedule.rating}</p>
                    </div>
                </div>
            </Link>
        )
    }

    // return html + CSS front-end design for main page
    function ScheduleList({ recommend }) {
        return (
            <div>
                {recommend.map(schedule => (
                    <Schedule schedule={schedule} key={schedule.course_code} />
                ))}
            </div>
        )
    }

    // return 
    return (
        <div class="main-page-LCg">
            <div class="left-bar-TYC">
                {/*  left-side drawer for navigation */}
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
                        <Link class="my-profile-Jrt" style={{ backgroundColor: "#BA7FD4" }} to='/MainPage' state={state}>Main Page</Link>
                    </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/CourseInfoPage' state={state}>Course Information</Link>
                    </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/CourseManage' state={state}>Course Management</Link>
                    </div>
                    <div class="group-1-rzt">

                    </div>
                </div>
                <p class="cuhk-course-RwW" >CUHK Course</p>
                <Link className="image-3-wQ4" to='/MainPage' state={state}><img style={{ width: "100%", height: "100%" }} src={cu_logo}></img></Link>
            </div>
            <div class="auto-group-m6hh-rX2">
                <div class="all-courses-bjW">
                    <div class="group-456-6wA">
                        <div class="group-455-FZA">
                            <p class="today-schedule-QS4">Today schedule</p>

                        </div>
                        {/*  timetable skeleton table */}
                        <div class="timetable">
                            <div class="week-names">
                                <div>monday</div>
                                <div>tuesday</div>
                                <div>wednesday</div>
                                <div>thursday</div>
                                <div>friday</div>
                                <div class="weekend">saturday</div>
                            </div>
                            <div class="time-interval">
                                <div>08:30 - 09:15</div>
                                <div>09:30 - 10:15</div>
                                <div>10:30 - 11:15</div>
                                <div>11:30 - 12:15</div>
                                <div>12:30 - 13:15</div>
                                <div>13:30 - 14:15</div>
                                <div>14:30 - 15:15</div>
                                <div>15:30 - 16:15</div>
                                <div>16:30 - 17:15</div>
                                <div>17:30 - 18:15</div>
                            </div>
                            <div class="content">
                                {/*  timetable courses data */}
                                {time_table.map((div) => {
                                    return div;

                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="top-tutors-JeU">
                    <div class="group-469-rR6">
                        <p class="course-recommendation-nZe">Course recommendation</p>
                        <ScheduleList recommend={recommend} />

                    </div>

                </div>
            </div>
        </div>
    );
}


export default MaingePage;
