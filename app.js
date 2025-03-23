require('dotenv').config();  // Load environment variables
const express = require('express');  // Import express
const app = express();  // Create an Express application
const path = require('path');  // For working with file and directory paths
const nodemailer = require('nodemailer');  // For sending emails

// Import the projects data
const projects = require('./projects.json');
console.log(projects["1"]);
console.log(projects["2"]);

// Import express-handlebars
const exphbs = require('express-handlebars');

// Set up Handlebars as the templating engine
app.set('views', path.join(__dirname, 'views'));  // Set the views folder path
app.engine('hbs', exphbs.engine({
  extname: 'hbs',  // Set the file extension for views
  defaultLayout: false,  // No default layout (set to 'main' if you want one)
  helpers: require('./helpers'),  // Include custom helpers if you have them
}));
app.set('view engine', 'hbs');  // Set Handlebars as the view engine

// Use built-in express middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Parse JSON data

// Serve static files (e.g., images, stylesheets, JavaScript files)
app.use(express.static(path.join(__dirname, '/public')));

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Work page route - renders a list of projects
app.get('/work', (req, res) => {
  res.render('work', { projects: projects });
});

// Project details route - renders a specific project by ID
app.get('/project/:pid', (req, res) => {
  console.log("log project id");
  console.log(req.params.pid);
  const pid = req.params.pid;  // Get the project ID from the URL parameter
  const thisProject = projects[pid.toString()];  // Get the project details by ID
  console.log(thisProject);
  res.render('project', { project: thisProject });
});

// Contact form route
app.get('/contact', (req, res) => {
  res.render('contact');  // Render the contact form page
});

// About page route
app.get('/about', (req, res) => {
  res.render('about');  // Render the about page
});

// Set up Nodemailer to send emails
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,  // Your email (from the .env file)
    pass: process.env.PASSWORD,  // Your email password (from the .env file)
  }
});

// Handle the contact form submission
app.post('/contact', (req, res) => {
  console.log('Contact form posted');
  console.log(req.body);  // Log the form data for debugging
  const { fullname, email, note, subject } = req.body;  // Destructure the form fields

  // Set up email options
  let mailOptions = {
    from: process.env.EMAIL,  // Sender email
    to: process.env.EMAIL,  // Receiver email (could be another email, or the same as the sender)
    subject: subject,  // Subject of the email
    text: note,  // Plain text body
    html: `<b>Full Name:</b> ${fullname}<br><b>Email:</b> ${email}<br><b>Message:</b> ${note}`,  // HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error sending email:', err);
    } else {
      console.log('Email sent!');
      res.redirect('/contact');  // Redirect back to the contact page after the email is sent
    }
  });
});

// Set the port to either the environment variable or 3001 if not available
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
