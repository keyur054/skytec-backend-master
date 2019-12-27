var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    randomstring = require("randomstring"),
    _ = require('lodash'),
    crypto = require("crypto"),
    swig = require('swig'),
    helper = {};
    helper.commonPath = 'uploads/';
function encrypt(text) {
    var cipher = crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET_KEY)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-cbc', process.env.JWT_SECRET_KEY)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
helper.encrypt = encrypt;
helper.decrypt = decrypt;
helper.getTemplate = function (template, params) {
    params = params ? params : {};
    return swig.renderFile(__dirname + template + '.html', params);
}
helper.randomString = function (number, param) {
    number = number ? number : 32,
        param = param ? param : {};
    var params = _.extend({}, {
        length: number,
        charset: 'alphabetic'
    }, param)
    return randomstring.generate(params);
}
helper.sendEmail = function (subject, to, content, fromTitle, mergeAppName) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    var transporter = nodemailer.createTransport(smtpTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        //secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    //        // setup e-mail data with unicode symbols
    var sub = "";
    if (typeof mergeAppName != 'undefined' && mergeAppName == false) {
        sub = subject;
    } else {
        sub = process.env.APP_NAME + " : " + subject;
    }
    var mailOptions = {
        from: process.env.APP_NAME + " <" + process.env.EMAIL_USERNAME + ">", // sender address
        to: to, // list of receivers
        subject: sub, // Subject line
        html: content // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

};



module.exports = helper;