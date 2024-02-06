const nodemailer = require('nodemailer');
const Joi = require('joi');

const emailSchema = Joi.object({
  to: Joi.string().email().required(),
  otp: Joi.string().required(),
});

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendMail = async (transporter, to, otp) => {
  const subject = ' OTP Verification';
  const text = ("Reset Your Password using this  OTP",otp)
  const mailOptions = {
    from:process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { info, otp };
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

exports.sendEmail = async (req, res) => {
  const { to, otp } = req.body;

  try {
    emailSchema.validateAsync({ to, otp }); 
    const transporter = createTransporter();
    result = await sendMail(transporter, to, otp);
    res.send({ success: result, message: 'OTP sent successfully'})
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to send OTP' });
  }
};