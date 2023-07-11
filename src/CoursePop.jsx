import './MainPage.css';
import './course-management.css';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import cu_logo from './image/image-2-bg.png';
import cu_img from './image/image-4.png';
import { useNavigate, Link, useLocation } from "react-router-dom";

function CoursePop() {
    const { state } = useLocation();
    const [detail, setDetail] = useState([]);
    const [name, setName] = useState('');
    const [review, setReview] = useState([]);
    const [comment, setComment] = useState('');

    //Get the detailed course information according to course code from the server
    useEffect(() => {
        console.log(state.data[0]);
        console.log(state.data[1]);
        axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/CourseInfoPage/CoursePop', {
            data: state.data[0],
        })
            .then(function (response) {
                console.log(response.data);
                setDetail(response.data['info'][0]);
                setReview(response.data['review']);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function handleNameChange(event) {
        setName(event.target.value);
    }


    function handleCommentChange(event) {
        setComment(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
    }
    //Detailed information list
    function Schedule({ course }) {
        return (
            <a className="auto-group-sq1h-iy6 "  >
                <div className="melanie-grutt-V28">
                    <div className="group-461-QPz" style={{ width: "10rem" }}>
                        <p className="engg2100-Mq2">{course.course_code}</p>
                        <p className="software-engineering-t4G">Rating: {course.rating}</p>
                        <p className="rating-2-bUU" style={{ width: "45rem" }}>Review: {course.review_text}</p>
                    </div>
                </div>
            </a>
        )
    }

    function ScheduleList({ review }) {
        return (
            <div>
                {review.map(course => (
                    <Schedule course={course} key={course.course_code} />
                ))}
            </div>
        )
    }

    return (

        <div class="main-page-LCg">
            <div class="left-bar-TYC">
                <div class="rectangle-38-z2L">
                </div>
                <div class="log-out-7se">
                    <a class="log-out-kQp" href="/">Log out</a>
                </div>
                <div class="my-profile-YDW">
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/ProfilePage' state={state.data[1]}>My profile</Link>
                    </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/MainPage' state={state.data[1]}>Main Page</Link>
                    </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/CourseInfoPage' style={{ backgroundColor: "#BA7FD4" }} state={state.data[1]}>Course Information</Link>
                    </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to='/CourseManage' state={state.data[1]}>Course Management</Link>
                    </div>
                </div>
                <p class="cuhk-course-RwW" >CUHK Course</p>
                <Link class="image-3-wQ4" to='/MainPage' state={state.data[1]}><img style={{ width: "100%", height: "100%" }} src={cu_logo}></img></Link>
            </div>
            <div class="auto-group-m6hh-rX2">
                <div class="top-tutors-JeU">
                    <div class="group-469-rR6">
                        <p class="course-recommendation-nZe">Course Details</p>
                        <p class="course-recommendation-nZe-des">Code: {detail.course_code}</p>
                        <p class="course-recommendation-nZe-des">Name: {detail.course_name}</p>
                        <p class="course-recommendation-nZe-des">Description: {detail.course_description}</p>
                        <p class="course-recommendation-nZe-des">Credit: {detail.units}</p>
                        <p class="course-recommendation-nZe-des">Course level: {detail.course_level}</p>
                        <p class="course-recommendation-nZe-des">Professor: {detail.instructors}</p>
                        <p class="course-recommendation-nZe-des">Semester: {detail.semester}</p>

                    </div>
                </div>
                {space1};

                <div class="top-tutors-JeU">
                    <div class="group-469-rR6">
                        <p class="course-recommendation-nZe">Course Review</p>
                        <ScheduleList review={review} />

                    </div>

                </div>
                {space2};

            </div>
        </div>
    );
}



export default CoursePop;
