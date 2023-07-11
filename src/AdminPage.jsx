import './AdminPage.css';
import './MainPage.css';
import cu_logo from './image/image-2-bg.png';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import search_icon from './image/search.ico';
import axios from 'axios';


function AdminPage() {
    const [search, setSearch] = useState("");
    const [searchCourse, setSearchCourse] = useState("");
    const navigate = useNavigate();

    const [course, setPosts] = useState([]);
    const [users1, setUsers] = useState([]);

    // Fetch course and user data from amazon aws server
    useEffect(() => {
        axios.get('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/admin')
            .then(response => {
                setPosts(response.data['course']);
                setUsers(response.data['user']);
            });
    }, []);

    // Construct User data html block 
    function User(props) {
        const { sid, name, major, study_year } = props;
        return (
            <div className="hader-Vmz">
                <p className="item-1155123456-qqr">{sid}</p>
                <p className="james-mDi">{name}</p>
                <p className="csci-WSC">{major}</p>
                <p className="shaw-eHW">{study_year}</p>
                <button className="item-3-awr1" onClick={() => onRemove(sid)}>Delete</button>
            </div>
        )
    }

    // Function to map the list of users fetched from amazon aws
    function UserList({ data }) {
        return (
            <div>
                {data.map(users => (
                    <User key={users.sid} {...users} />
                ))}
            </div>
        )
    }

    // Remove user from amazon aws database
    const onRemove = (sid) => {
        const response = window.confirm("Do you want to delete the user?");
        if (response) {
            axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/admin/edit', {
                //   flag : user/course,
                //   data: userid / course code,
                flag: "user",
                data: sid

            })
                .then(function (response) {

                    alert("Deleted Successfully");
                    window.location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            alert("canceled");
        }

    }

    const handleChange = (e) => {
        setSearch(e.target.value.toLowerCase());
    };
    const filterUser = users1.filter((user) => {
        return user;
    })

    // Construct course data html block 
    function Course(props) {
        const { course_code, course_name, units, stream, } = props;
        return (
            <div className="hader-Vmz">
                <p className="item-1155123456-qqr">{course_code}</p>
                <p className="james-mDi">{course_name}</p>
                <p className="csci-WSC">{units}</p>
                <p className="shaw-eHW">{stream}</p>
                <button className="item-3-awr" onClick={() => onRemoveCourse(course_code)}>Delete</button>
            </div>
        )
    }

    // Function to map the list of courses fetched from amazon aws
    function CourseList({ data }) {
        return (
            <div >
                {data.map(courses => (
                    <Course key={courses.course_code} {...courses} />
                ))}
            </div>
        )
    }

    // Remove course from amazon aws
    const onRemoveCourse = (course_code) => {
        const response = window.confirm("Do you want to delete " + course_code + "?");
        if (response) {
            axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/admin/edit', {
                //   flag : user/course,
                //   data: userid / course code,
                flag: "course",
                data: course_code

            })
                .then(function (response) {

                    alert("Deleted Successfully");
                    window.location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            alert("canceled");
        }

    }

    const filterCourse = course.filter((course1) => {
        return course1.course_code.includes(searchCourse.toLowerCase()) || course1.course_name.toLowerCase().includes(searchCourse.toLowerCase());
    })
    const handleChange2 = (e) => {
        setSearchCourse(e.target.value.toLowerCase());
    };

    // return html + CSS front-end design for admin page
    return (
        <div className="admin-page-qzQ main-page-LCg">
            <div className="auto-group-ospu-9VJ">
                <div className="left-bar-TYC">
                    <div className="rectangle-38-z2L">
                    </div>
                    <div className="log-out-7se">
                        {/* Log out button */}
                        <a className="log-out-kQp" href="/">Log out</a>
                    </div>
                    <div className="my-profile-YDW">
                        <div className="group-1-rzt">
                            <Link class="my-profile-Jrt" to='/AdminPage' style={{ backgroundColor: "#BA7FD4" }} >Admin Page</Link>
                        </div>
                    </div>
                    <p className="cuhk-course-RwW" >CUHK Course</p>
                    {/* image which directs to admin page */}
                    <Link class="image-3-wQ4" to='/AdminPage' ><img style={{ width: "100%", height: "100%" }} src={cu_logo}></img></Link>
                </div>
                <div className="auto-group-6uvf-SAC">
                    <div className="auto-group-gmum-yvp">
                        <p className="admin-system-KDz">Admin System</p>
                        <p className="user-information-jHi">User Information</p>
                    </div>
                    <div className="top-tutors-GHe">
                        <div className="auto-group-6e2f-b52">
                            <div className="search-box-1Y4">
                                <div className="group-407-XWQ">
                                    {/* Search User Part */}
                                    <img style={{ width: "100%", height: "100%", marginRight: "2rem" }} src={search_icon}></img>
                                    <input type='text' className="search-2CG" maxLength='20' placeholder='Search User Here'
                                        onChange={handleChange} />

                                </div>
                            </div>
                        </div>
                        {/* User list table */}
                        <div className="group-469-LTr">
                            <div className="recommended-course-list-fFE">
                                <div className="hader-CFA">
                                    <p className="sid-wiY">SID</p>
                                    <p className="name-5pk">Name</p>
                                    <p className="program-R7v">Program</p>
                                    <p className="college-YyE">Study Year</p>
                                    <p className="study-year-h5S">Edit</p>
                                </div>
                                <div className="frame-483-ELG">
                                </div>
                            </div>
                            <div style={{ overflow: "auto" }}>
                                {/* Showing User List */}
                                <div className="basics-of-mobile-ux-yoe" ><UserList key={users1.sid} data={filterUser} /></div>

                            </div>
                        </div>
                    </div>
                    <div className="auto-group-gmum-yvp">
                        <p className="user-information-jHi">Course Information</p>
                    </div>
                    <div className="top-tutors-GHe">
                        <div className="auto-group-6e2f-b52">
                            <div className="search-box-1Y4">
                                <div className="group-407-XWQ">
                                    {/* Search course Part */}
                                    <img style={{ width: "100%", height: "100%", marginRight: "2rem" }} src={search_icon}></img>
                                    <input type='text' className="search-2CG" maxLength='20' placeholder='Search Course Here'
                                        onChange={handleChange2} />
                                </div>
                            </div>
                        </div>
                        {/* Course List table */}
                        <div className="group-469-LTr">
                            <div className="recommended-course-list-fFE">
                                <div className="hader-CFA">
                                    <p className="sid-wiY">Code</p>
                                    <p className="name-5pk">Name</p>
                                    <p className="program-R7v">Units</p>
                                    <p className="college-YyE">Stream</p>
                                </div>
                                <div className="frame-483-ELG">
                                </div>
                            </div>
                            <div className="basics-of-mobile-ux-yoe">
                                {/* Showing Course List */}
                                <CourseList key={course.course_code} data={filterCourse} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default AdminPage;
