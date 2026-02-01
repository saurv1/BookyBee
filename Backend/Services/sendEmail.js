const nodemailer = require('nodemailer');

const sendEmail = async(options) => {

    const user = process.env.SMTP_USER || "bookybee.service@gmail.com";
    const pass = process.env.SMTP_PASS || "dkpniuhqfrecchal";
    const from = process.env.SMTP_FROM || "BookyBee";
    // Create a transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user,
            pass,
        },
    });

    const mailOptions = {
        from,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try 
    {
        await transporter.sendMail(mailOptions);
    } 
    catch (err) 
    {
        console.error("Failed to send email:", err.message);
        throw err;
    }
};

module.exports = sendEmail;