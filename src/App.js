import './App.css';
import Login from './Login';
import Signup from './Signup';
import Mainpage from './MainPage';
import ProfilePage from './ProfilePage';
import CourseInfoPage from './CourseInfoPage';
import CoursePop from './CoursePop';
import AdminPage from './AdminPage';
import CourseManage from './Course_Manage';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path = {"/*"} element ={<Login />}></Route>
        <Route path = {"/Login"} element ={<Login />}></Route>
        <Route path = {"/Signup"} element = {<Signup />}></Route>
        <Route path = {"/MainPage"} element = {<Mainpage />}></Route>
        <Route path = {"/MainPage/CoursePop"} element = {<CoursePop />}></Route>
        <Route path = {"/CourseManage"} element = {<CourseManage />}></Route>
        <Route path = {"/ProfilePage"} element = {<ProfilePage />}></Route>
        <Route path = {"/CourseInfoPage"} element = {<CourseInfoPage />}></Route>
        <Route path = {"/CourseInfoPage/CoursePop"} element = {<CoursePop />}></Route>
        <Route path = {"/ProfilePage/CoursePop"} element = {<CoursePop />}></Route>
        <Route path = {"/AdminPage"} element = {<AdminPage />}></Route>
      </Routes>
      
      </BrowserRouter>

    </div>
  )
  
}




