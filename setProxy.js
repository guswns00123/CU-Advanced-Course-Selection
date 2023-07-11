// file for setting proxy server
var proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        proxy('/wow', {
            target: 'http://localhost:3005/'
        })
    );
    app.use(
        proxy('/verify', {
            target: 'http://localhost:3005/'
        })
    );
    app.use(
        proxy('/signup', {
            target: 'http://localhost:3005/'
        })
    );
    app.use(
        proxy('/CourseInfoPage', {
            target: 'http://localhost:3005/'
        })
    );
    app.use(
        proxy('/CourseInfoPage/CoursePop', {
            target: 'http://localhost:3005/'
        })
    );
    app.use(
        proxy('/ProfilePage', {
            target: 'http://localhost:3005/'
        })
    );
    
};
