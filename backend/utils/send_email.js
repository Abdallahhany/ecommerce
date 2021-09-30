const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const sendEmail = async options => {
    const transporter = nodemailer.createTransport(sendGridTransport({
        auth: {
            api_key: process.env.auth
        }
    }));

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

module.exports = sendEmail;