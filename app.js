require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
const nodemailer = require('nodemailer');

var projects = require('./projects.json');
console.log(projects["1"]);
console.log(projects["2"]);

var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: false,
  helpers: require('./helpers')
}));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));


app.get('/', function(req, res) { // create a route for the index page
    res.render('home');
});
app.get('/work', function(req, res) {
    res.render('work', {projects: projects});
});
app.get('/project/:pid', function(req, res, next) {
    console.log("log project id");
    console.log(req.params.pid);
    var pid = req.params.pid
    var thisproject = projects[pid.toString()];
    console.log(thisproject);
    res.render('project', {project: thisproject});
})
app.get('/contact', function(req, res) {
    res.render('contact');
});
// step 1 - transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
app.post('/contact', function(req, res, next) {
    console.log('contact form posted');
    console.log(req.body);
    var name = req.body.fullname;
    var email = req.body.email;
    var note = req.body.note;
    var subject = req.body.subject;
    // step 2
    let mailOptions = {
        from: 'manndummy16@gmail.com',
        to: 'manndummy16@gmail.com',
        subject: req.body.subject,
        text: req.body.note,
        html: "<b>Full Name   </b>" + name + "<br><b>Email   </b>" + email + "<br><b>Message   </b>" + note// html body
    };
    // step 3
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('Error sending email.');
        } else {
            console.log('Email sent!')
        }
    });
});
app.get('/about', function(req, res) {
    res.render('about');
});



var port = process.env.PORT || 3001;
app.listen(port);
console.log('Express started. Listening on port %s', port);