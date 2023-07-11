import './CourseInfoPage.css';
import './MainPage.css';
import './course-management.css';
import cu_logo from './image/image-2-bg.png';
import React, { useState,useEffect } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import search_icon from './image/search.ico';
import axios from 'axios';


function CourseInfoPage() {
    const [search, setSearch] = useState("");
    const [post, setPosts] = useState([]);
    const {state} = useLocation();
    const [sid, setSid] = useState("");
    
    //Get the course information from the server and save it in post
    useEffect(() => {
        axios.get('http://ec2-3-26-19-15.ap-southeast-2.compute.amazonaws.com:3005/CourseInfoPage')
            .then(response => {
                setPosts(response.data);
            });
    }, []);

    //When CourseInfoPage is implemented, get the SID
    useEffect(() => {

        console.log(state);
        setSid(state);

      }, []);


  const selectList = ["Category","CourseCode", "CourseName", "Stream"];
  const [option, setOption] = useState("");
  const handleSelect = (e) => {
    setOption(e.target.value);
  }

    var i = 0;
    const handleChange = (e) => {
        setSearch(e.target.value.toLowerCase())
        
    };

    // Filtering according to the search category
    const filterCourse = post.filter((course1) => {
        if (option ==='CourseCode'){
            return course1.course_code.toLowerCase().includes(search.toLowerCase());
        }else if (option === 'CourseName'){
            return course1.course_name.toLowerCase().includes(search.toLowerCase());
        }else if(option === 'Stream'){
            return course1.stream.toLowerCase().includes(search.toLowerCase());
        }
        else{
            return course1.course_name.toLowerCase().includes(search.toLowerCase()) || course1.course_code.toLowerCase().includes(search.toLowerCase());
        }
        
    })
    
    //Course information list according to the post data
    function CardList({ data }) {
        return (
            <div>
                {data.map((post) => (
                    <Card key={post.course_code} {...post} />
                ))}
            </div>
        )
    }

    //Specific course information list according to the post data
    function Card(props) {
        const {course_code, course_name, professor, units, stream } = props;
        return (
            <div className="hader-TSY" >
                <p className="course-code-bYk" style ={{width :"11rem"}}>{course_code}</p>
                <p className="course-name-82t" style ={{width :"31rem", overflow:"hidden", marginRight:"5rem"}}>{course_name}</p>
                <p className="units-T5A" style ={{width :"13rem"}}>{units}</p>
                <p className="grade-BWx"style ={{width :"16rem"}}>{stream}</p>
                {/* <p className="done-K7N"></p> */}
                <Link className="moreinfo" style={{ marginLeft: "14rem" }} to ='./CoursePop' state={{data: [course_code,sid]}}>More details</Link>
            </div>
        )
    }

    return (
        <div className="main-page-LCg course-management-MWG">
            <div className="left-bar-TYC">
                <div className="rectangle-38-z2L">
                </div>
                <div className="log-out-7se">
                    <a className="log-out-kQp" href="/">Log out</a>
                </div>
                <div className="my-profile-YDW">
                <div class="group-1-rzt"> 
                        <Link class="my-profile-Jrt" to ='/ProfilePage' state={state}>My profile</Link>
                </div>
                    <div class="group-1-rzt">
                        <Link class="my-profile-Jrt" to ='/MainPage' state={state}>Main Page</Link>
                    </div>
                    <div class="group-1-rzt">  
                        <Link class="my-profile-Jrt" to ='/CourseInfoPage' style = {{backgroundColor:"#BA7FD4"}} state={state}>Course Information</Link>
                    </div>
                    <div class="group-1-rzt">  
                        <Link class="my-profile-Jrt" to ='/CourseManage' state={state}>Course Management</Link>
                    </div>
                
                    
                </div>
                <p className="cuhk-course-RwW" >CUHK Course</p>
                <Link class="image-3-wQ4" to ='/MainPage' state={state}><img style = {{width:"100%", height:"100%"}} src = {cu_logo}></img></Link>
                
                <div style = {{padding:"0px 0px 0px 260px"}} className="auto-group-lbgx-3yz">
                    <div className="course-search-for-add-hJx" >
                        <div className="rectangle-386-eEC" ></div>
                        <div className="all-courses-Zc4" style={{ overflow: "auto", height: "200%" }}>
                            <CardList key={post.course_code} data={filterCourse} />
                        </div>
                        <div className="group-478-Sr4">
                            <div className="frame-455-An4">
                                <div  className="courses-h1J" >Courses</div>
                                <div className="search-box-J9W" style ={{width:"66rem"}}>
                                    <div className="group-407-DXN" style={{left:"0rem"}}>
                                        <img style={{ width: "100%", height: "100%", marginRight: "0.5rem" }} src={search_icon}></img>
                                        
                                        <select onChange={handleSelect} value = {option} style ={{marginRight:"0.5rem"}}>
                                            {selectList.map((item) => (
                                                <option value ={item} key = {item}>
                                                    {item}
                                                </option>
                                            ))}

                                        </select>

                                        <input type='text' className="search-Vzg" maxLength='20' placeholder='Search Course Here' style={{border:"solid black 1px", borderradius:"1rem"}}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="hader-D9z">
                                <p className="course-code-YTA" style ={{width :"4.5rem"}}>Course Code</p>
                                <p className="course-name-H9r" style ={{width :"31rem"}}>Course Name</p>
                                <p className="units-QEU" style ={{width :"9rem"}}>Units</p>
                                <p className="grade-9C4"style ={{width :"16rem"}}>Stream</p>
                                <p className="status-V12">More info</p>
                                <p className="seats-poz"></p>
                                <p className="add-NKi"></p>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}



export default CourseInfoPage;
