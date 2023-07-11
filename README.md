<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">


  <h3 align="center">CU advanced Course Selection System</h3>

  <p align="center">
    Group B7 CSCI3100 project
    <br />
    <br />
    <br />
  </p>
</div>




<!-- ABOUT THE PROJECT -->
## About The Project

This project is a web-based application for course selection system which enables students to browse and select courses offered by the university, and admin to manage the student and courses. It would be an ultimate replacement of CUHK’s course selection system, CUSIS. 
Our system follows a client-server architecture. Clients interact with the user through UI and sending API calls to the server. Server receives API calls, query and receive data from the SQL database. It would have additional features such as course recommendation and review pages which would enlarge the user experience. 

## Main Features

 The first main feature is a login features. Login feature will verify each user's login attempt. After login, the application will display two main pages for users - course browsing page and the profile page.<br />
 In the course browsing page, users can search eligible courses based on course ID, name, time, department etc. The course information includes course ID, course name, time, place, department, instructor, capacity, and course details. <br />
 Eligible courses (for example, courses with no capacity will not be able to be selected) can be selected, and added by users.<br />
 The profile page will display courses selected by users and also will contain features to drop selected courses by pressing the drop button. <br />
 There will be two types of users - normal users and admin users. Normal users can do all the basic functionalities mentioned above, and admin users can view all course/user information and delete courses/users if needed. <br />
 Our application’s advanced functionalities include course recommendation system, and course review system with user-friendly and appealing UI. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* ![Next][Express.js]
* ![React][React.js]
* ![aws.com][aws.com]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
Sample installation guide for Ubuntu linux
### Prerequisites
OS: Ubuntu 20.04 LTS 
* npm
  ```sh
  npm install npm@latest -g
  ```
* node js
  ```sh
  sudo apt install nodejs
  ```
* configuration of db
```#backend/config.js
  module.exports = {
  host: 'address of database',
  port: '3306',
  user: 'user_name',
  password: 'password',
  multipleStatements: true
  };
 ```
### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/F-los/CSCI3100_GroupProject.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
3. Run the express server
   ```js
   ./node server.js
   ```
4. Run the react server
   ```js
   cd src
   npm start
   ```
5. Access the simulator with web brower
URL = http://localhost:3000/
<img width="1348" alt="main" src="https://user-images.githubusercontent.com/60544007/236440090-e69ba552-f1c0-4393-b2a7-0211bd288a24.png">



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[aws.com]: https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white
