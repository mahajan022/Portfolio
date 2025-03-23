require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');

const projects = require('./projects.json');
console.log(projects["1"]);
console.log(projects["2"]);

const exphbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: false,
  helpers: require('./helpers'),
}));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.render('home'));
app.get('/work', (req, res) => res.render('work', { projects }));

app.get('/project/:pid', (req, res) => {
  console.log("log project id:", req.params.pid);
  const thisProject = projects[req.params.pid.toString()];
  console.log(thisProject);
  res.render('project', { project: thisProject });
});

app.get('/contact', (req, res) => res.render('contact'));
app.get('/about', (req, res) => res.render('about'));

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});

app.post('/contact', (req, res) => {
  console.log('Contact form posted:', req.body);
  const { fullname, email, note, subject } = req.body;

  let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject,
    text: note,
    html: `<b>Full Name:</b> ${fullname}<br><b>Email:</b> ${email}<br><b>Message:</b> ${note}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.log('Error sending email:', err);
    else console.log('Email sent!');
    res.redirect('/contact');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
