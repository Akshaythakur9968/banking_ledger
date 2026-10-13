require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"AKSHAY BANK" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name ){
    const subject = "Welcome to Akshay Bank!";
    const text = `hello ${name} ,\n\n thank you for registering at Akshay Bank.
    we're excited to have you on board \n\n best regards,\n the Akshay Bank team`;
    const html =`<p>hello ${name},</p><p> thank you for registering at Akshay Bank . we're excited to have you on board <p/><p> best regards,<br>the Akshay Bank Team </p>`;

    await sendEmail(userEmail,subject,text,html);

}


async function sendTransactionEmail(userEmail,name,amount,toAccount){
  const subject =  'Transaction Successfully';
  const text = `hello ${name}, \n\nYour transaction of $${amount} to account ${toAccount}was Successful. \n\nBest regards,\n\nthe AKSHAY BANK`;
  const html = `<p>Hello ${name},</p><p> Your Transaction of $${amount}to account ${toAccount}was successful.</p.<p>Best Regards,<br>the AKSHAY BANK`;

  await sendEmail(userEmail,subject,text,html);
}

async function sendTransactionFailureEmail(userEmail,name,amount,toAccount){
    const subject =  'Transaction Failed';
  const text = `hello ${name}, \n\nwe regret to inform you that your transaction of $${amount} to account ${toAccount}was Failed. \n\nBest regards,\n\nthe AKSHAY BANK`;
  const html = `<p>Hello ${name},</p><p> we regret to inform you that your Transaction of $${amount}to account ${toAccount}was Failed.</p.<p>Best Regards,<br>the AKSHAY BANK`;

  await sendEmail(userEmail,subject,text,html);
}

module.exports = {sendRegistrationEmail, sendTransactionEmail,sendTransactionFailureEmail};