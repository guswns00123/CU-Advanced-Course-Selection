import './ProfilePage.css';
import './MainPage.css';
import cu_logo from './image/image-2-bg.png';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from 'axios';


function ProfilePage() {
    const { state } = useLocation();
    const [userinfo, setUserinfo] = useState([]);
    const [courseinfo, setCourseinfo] = useState([]);
    const [sid, setSid] = useState("");

    // Fetch user profile data from amazon aws
    useEffect(() => {
        setSid(state);
        axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/ProfilePage', {
            data: state,
        })
            .then(function (response) {
                setUserinfo(response.data['user']);
                setCourseinfo(response.data['course']);;
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    // html block for scheduled course display 
    function Schedule({ schedule, onRemove }) {
        return (
            <div className="hader-9jE">
                <p className="course-name-6Pa">{schedule.course_code}</p>
                <p className="date-Rgk">{schedule.day.substring(0, 3)}</p>
                <p className="start-time-xwa">{schedule.start_time.substring(0, 5)}</p>
                <p className="end-time-WTJ">{schedule.end_time.substring(0, 5)}</p>
                <p className="location-rGG" >{schedule.location}</p>

                <Link className="enrolled-nvc" to='./CoursePop' state={{ data: [schedule.course_code, sid] }}>More details</Link>
            </div>
        )
    }

    // map course schedule for display
    function ScheduleList({ courseinfo, onRemove }) {
        return (
            <div>
                {courseinfo.map(schedule => (
                    <Schedule schedule={schedule} key={schedule.course_code} onRemove={onRemove} />
                ))}
            </div>
        )
    }

    // Delete course from Schedule list
    const onRemove = (course_code) => {
        setCourseinfo(courseinfo.filter(courseinfo => courseinfo.course_code != course_code));
    }

    // return html + CSS front-end design for profile page
    return (
        <div className="user-profile-page-VuA main-page-LCg">
            <div className="left-bar-TYC">
                {/* left-side drawer for navigation */}
                <div className="rectangle-38-z2L">
                </div>
                <div className="log-out-7se">
                    <a className="log-out-kQp" href="/">Log out</a>
                </div>
                <div className="my-profile-YDW">
                    <div className="group-1-rzt">
                        <Link className="my-profile-Jrt" style={{ backgroundColor: "#BA7FD4" }} to='/ProfilePage' state={state}>My profile</Link>
                    </div>
                    <div className="group-1-rzt">
                        <Link className="my-profile-Jrt" to='/MainPage' state={state}>Main Page</Link>
                    </div>
                    <div className="group-1-rzt">
                        <Link className="my-profile-Jrt" to='/CourseInfoPage' state={state}>Course Information</Link>
                    </div>
                    <div className="group-1-rzt">
                        <Link className="my-profile-Jrt" to='/CourseManage' state={state}>Course Management</Link>
                    </div>
                </div>
                <p className="cuhk-course-RwW" >CUHK Course</p>
                <Link className="image-3-wQ4" to='/MainPage' state={state}><img style={{ width: "100%", height: "100%" }} src={cu_logo}></img></Link>

            </div>
            <div className="auto-group-xukh-6ZW">
                <div className="auto-group-v29r-SNU">
                    <div className="weekly-schedule-nhE">
                        <div className="rectangle-387-7Uc">
                        </div>
                        <div className="schedule-list-p1e">
                            {/* User profile information table  */}
                            <div className="auto-group-x62o-YCY">

                                <div className="hader-rj2">
                                    <p className="student-name-aQ8">Student Name</p>
                                    <p className="tony-kim-6tG">{userinfo.name}</p>
                                </div>
                                <div className="hader-3Hi">
                                    <p className="sid-mzQ">SID</p>
                                    <p className="item-1155123419-Wh6">{userinfo.sid}</p>
                                </div>
                                <div className="hader-Esz">
                                    <p className="program-yqa">Program</p>
                                    <p className="csci-vVv">{userinfo.major}</p>
                                </div>
                                <div className="hader-Esz">
                                    <p className="program-yqa">Stream</p>
                                    <p className="csci-vVv">{userinfo.stream}</p>
                                </div>
                                <div className="hader-NWL">
                                    <p className="admitted-term-hHi">Admitted Term</p>
                                    <p className="term-1-bdz">{userinfo.admission_year}</p>
                                </div>
                                <div className="hader-hh2">
                                    <p className="email-DQU">Email</p>
                                    <p className="linkcuhkeduhk-7kk">{userinfo.email}</p>
                                </div>
                                <div className="hader-cSc">
                                    <p className="study-year-k32">Study Year</p>
                                    <p className="item-3-stL">{userinfo.study_year}</p>
                                </div>

                            </div>
                        </div>
                        <div className="frame-455-ZVa">
                            <p className="my-academics-hLt">My Academics</p>
                        </div>
                    </div>
                </div>
                {/*  User schedueld course information table  display*/}
                <div className="weekly-schedule-RMz">
                    <div className="auto-group-egbd-A4g">
                        <div className="schedule-list-5hS" style={{ overflow: "auto" }}>
                            <ScheduleList courseinfo={courseinfo} onRemove={onRemove} />
                        </div>
                    </div>
                    <div className="group-477-rmN">
                        <p className="my-courses-x5e">My courses</p>
                        <div className="hader-Gs2">
                            <p className="course-name-nqN">Course Code</p>
                            <p className="date-LM6">Day</p>
                            <p className="start-time-sbv">Start time</p>
                            <p className="end-time-D9z">End time</p>
                            <p className="location-Yxx">Location</p>
                            <p className="enrolled-VdJ">More info</p>

                        </div>
                    </div>
                    <div className="group-445-2t8">
                    </div>
                </div>
            </div>
        </div>
    );
}



export default ProfilePage;
