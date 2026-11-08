const nodemailer = require('nodemailer');

const sendEmailNotification = async ({ to, subject, text }) => {
    console.log(`[Email Mock] Sent mail to: ${to} | Subject: ${subject}`);
    return true;
};

module.exports = { sendEmailNotification };