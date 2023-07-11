import './login.css';
import axios from 'axios';
import React, { useState } from 'react';
import cu_logo from './image/image-2-bg.png';
import cu_img from './image/image-4.png';
import {useNavigate, Link} from "react-router-dom";



  
function Login() {
  const [inputId, setId] = useState('')
  const [inputPw, setPw] = useState('')
  const [button, setButton] = useState(true);
  const realId = "1155100531@link.cuhk.edu.hk";
  const realPw = "12345678";
  const navigate = useNavigate();

  function changeButton(){
    inputId.includes('@') && inputPw.length >=5 ? setButton(false) : setButton(true);
  }

  const id_input = (e) => {
    setId(e.target.value);
  }

  const pw_input = (e) => {
    setPw(e.target.value);
  }
  
  //Login process(Send login info to the server)
  function handleSubmit(e) {
      e.preventDefault();
      console.log();
      axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/verify', {
        ID: inputId,
        Password: inputPw
      })
      .then(function (response) {
        //User login
        if (response.data['user'] === true){
            goToMain();
        //Admin login
        }else if (response.data['admin'] === true){
            goToAdmin();
        //Wrong input
        }else{
          alert("Incorrect Info!");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    };
    
  //Go to mainpage with sid
  const goToMain = () =>{
    navigate("MainPage", { state: inputId });

  }
  //Go to admin page
  const goToAdmin = () =>{
    navigate("AdminPage");
  }
  
  return (
  
  <div className="main_border">
  <div className="main_name">
    <div ><a href = "/"><img src = {cu_logo}></img></a></div>
    <div className="cu_logo"></div>
    <p className="name">CUHK Course Selection System</p>
  </div>
  <div className="login_part">
    <div className="head">
      <div className="headline">
        <p className="login-page">Login page</p>
        <p className="info">Please fill your detail to access your account.</p>
      </div>
      <div className="id_part">
        <p className="id_head">SID</p>
        <div className="id_frame">
          <div className="id_frame2">
            <input className="id_text" 
            type="text" 
            align="center" 
            placeholder="SID"
            onChange={id_input}
            onKeyUp={changeButton}></input>
            
          </div>
        </div>
      </div>
      <div className="pw_part">
        <p className="pw_head">Password</p>
        <div className="pw_frame">
          <div className="pw_frame2">
            <input className="pw_text"
             type="password"
              align="center"
               placeholder="••••••••"
               onChange={pw_input}
               onKeyUp={changeButton}></input>   
          </div>
        </div>
      </div>
      <button className="loginbtn" type='button' onClick={handleSubmit} > Login</button>
      <p className="signup_part">
        <span>Don’t have an account  ?   </span><a href = "/Signup"> Sign up</a>
      </p>
    </div>
    <img className="main_img" src={cu_img}/>
  </div>
</div>
    
  );
}



export default Login;
