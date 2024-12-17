const nodemailer = require('nodemailer');

exports.sendEmailNotification = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dhavalpatel.rw@gmail.com',
        pass: 'Dhaval930@#123', // or use environment variables
      },
    });

    const mailOptions = {
      from: 'dhavalpatel.rw@gmail.com',
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
