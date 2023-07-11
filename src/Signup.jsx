import './signup.css';
import React, { useState, useEffect } from 'react';
import cu_logo from './image/image-2-bg.png';
import cu_img from './image/image-4.png';
import {useNavigate} from "react-router-dom";
import axios from 'axios';


function Signup(){
    const [inputName, setName] = useState('')
    const [inputid, setId] = useState('')
    const [inputEmail, setEmail] = useState('')
    const [inputMajor, setMajor] = useState('')
    const [inputYear, setYear] = useState('')
    const [inputStream, setStream] = useState('')
    const [inputPw, setPw] = useState('')
    const [inputConfirm, setConfirm] = useState('')
    const [button, setButton] = useState(true);
    const navigate = useNavigate();


    const majorList = ["Major", "Computer science", "IBBA", "Biomedical Engineering", "Computer Engineering"];
    const yearList = ["Year","2017", "2018","2019","2020","2021","2022"];
    const streamList = ["General","Intelligence Science","Database and Information Systems","Rich Media","Distributed Systems, Networks and Security","Algorithms and Complexity","Data Analytics"]
    const handleSelect = (e) => {
    setMajor(e.target.value);
    }
    const handleSelect2 = (e) => {
      setYear(e.target.value);
      }
    const handleSelect3 = (e) =>{
      setStream(e.target.value);
    }
  //Sign up process(Send information to the server)
  function handleSubmit(e) {
      e.preventDefault();
      console.log();
      axios.post('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/signup', {
        ID : inputid,
        name: inputName,
        passwd: inputPw,
        repasswd: inputConfirm,
        email: inputEmail,
        major: inputMajor,
        stream: inputStream,
        year: inputYear
      })
      .then(function (response) {

        alert(response.data[1]);
        //Success sign up
        if (response.data[0] === true){
          goToLogin();
        }
        
      })
      .catch(function (error) {
        console.log(error);
      });
      // console.log(pw_input);
    };

    function changeButton(){
      inputName.length >= 1 && inputEmail.length >=1 && inputPw.length >=1 && inputid.length >= 1 ? setButton(false) : setButton(true);
    }
    const check_info = (e) => {
      if (inputPw == inputConfirm){
        e.stopPropagation();
        
      }else{
        alert('pw and confirm pw is not same');
      }
    }

    const goToLogin = () => {
      navigate('/');
    }

    const name_input = (e) =>{
      setName(e.target.value);  
    }
    const id_input = (e) =>{
      setId(e.target.value);
    }
    const email_input = (e) =>{
      setEmail(e.target.value);  
    }

    const pw_input = (e) =>{
      setPw(e.target.value);  
    }

    const confirm_input = (e) =>{
      setConfirm(e.target.value);  
    }

    return (
<div className="main_border">
  <div className="main_name">
    <div ><a href = "/"><img src = {cu_logo}></img></a></div>
    <div className="cu_logo"></div>
    <p className="cuhk-course-selection-system-46C">CUHK Course Selection System  </p>
  </div>

  <div className="signup_part">
    <div className="head">
      <div className="main_format">
        <div className="head_format">
          <div className="headline">
            <p className="sign-up">Sign up</p>
            <p className="info">Please fill your detail to create your account.</p>
          </div>
          
          <div className="name_part">
            <p className="name_head">Name</p>
            <div className="name_frame">
              <div className="name_frame2">
                <input className="name_text" 
            type="text" 
            align="center" 
            placeholder="Name"
            onChange={name_input}
            onKeyUp={changeButton}></input>
              </div>
            </div>
          </div>

          <div className="email_part">
            <p className="email_head">SID</p>
            <div className="email_frame">
              <div className="email_frame2">
                <input className="mail_text" 
            type="text" 
            align="center" 
            placeholder="SID"
            onChange={id_input}
            onKeyUp={changeButton}></input>
              </div>
            </div>
          </div>
          <div className="email_part">
            <p className="email_head">Email</p>
            <div className="email_frame">
              <div className="email_frame2">
                <input className="mail_text" 
            type="text" 
            align="center" 
            placeholder="Email"
            onChange={email_input}
            onKeyUp={changeButton}></input>
              </div>
            </div>
          </div>       
          <div className="major_part">
          <div className="major_head">
              <p className="major_head2">Your Major</p>
              <div className="major_frame">
                
                <select className="major_frame2" onChange={handleSelect} value = {inputMajor} style ={{}}>
                                            {majorList.map((item) => (
                                                <option value ={item} key = {item}>
                                                    {item}
                                                </option>
                                            ))}

                                        </select>
        
              </div>
            </div>
            <div className="major_head">
              <p className="major_head2">Your Stream</p>
              <div className="major_frame">
                
                <select className="major_frame2" onChange={handleSelect3} value = {inputStream} style ={{}}>
                                            {streamList.map((item) => (
                                                <option value ={item} key = {item}>
                                                    {item}
                                                </option>
                                            ))}

                                        </select>
        
              </div>
            </div>
            <div className="year_part">
              <p className="year_head">Your Year</p>
              <div className="year_frame">
                
                <select className="year_frame2" onChange={handleSelect2} value = {inputYear}>
                                            {yearList.map((item) => (
                                                <option value ={item} key = {item}>
                                                    {item}
                                                </option>
                                            ))}

                                        </select>

              </div>
            </div>
          </div>
          <div className="password_part">
            <p className="password_head">Password</p>
            <div className="password_frame">
              <div className="password_frame2">
                
                <input className="pw_text" 
            type="text" 
            align="center" 
            placeholder="••••••••"
            onChange={pw_input}
            onKeyUp={changeButton}></input>
              </div>
            </div>
          </div>
          <div className="confirm_part">
            <p className="confirm_head">Confirm Password</p>
            <div className="confirm_frame">
              <div className="frame-4-5cC">
                <input className="confirm_text" 
            type="text" 
            align="center" 
            placeholder="••••••••"
            onChange={confirm_input}
            onKeyUp={changeButton}></input>
              </div>
            </div>
          </div>
        </div>
        
        <button className="signupbtn" type='button' disabled={button} onClick={handleSubmit} >Sign up</button>
      </div>
    </div>
    
    <img className="main_img" src={cu_img}/>
  </div>
</div>

    )
}



export default Signup;