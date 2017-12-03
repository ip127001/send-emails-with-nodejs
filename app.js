const express = require('express');
const bodyParser = require('body-parser');
const handlebar = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

//view engine setup
app.engine('handlebars', handlebar());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res){
    res.render('contact');
});

app.post('/send', function(req, res){
    const output =  `
    <p>you have a new conact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'youremail@example.com', // generated ethereal user
            pass: 'youremailpassword'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Node developer" <youremail@example.com>', // sender address
        to: 'otherperson1email@example.com, otherperson2email@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Email has been sent'});
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log('server started');
});
