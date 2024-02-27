const nodemailer = require('nodemailer');
const Joi = require('joi');
const db = require('../config/database');

const emailSchema = Joi.object({
  to: Joi.string().email().required(),
  otp: Joi.string(),
  booking_id: Joi.string(),
  category: Joi.string(),
  ID: Joi.string()
});

// Function to create a nodemailer transporter
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

const sendMail = async (transporter, to, otp, category, booking_id, userDetails) => {
  let subject, text;

  switch (category) {
    case 'otpVerification':
      subject = 'OTP Verification';
      text = ` Reset Your Password using this OTP: ${otp}`;
      break;

    case 'Passenger':
      try {
        const bookingDetails = await passengerDetails(booking_id);
        subject = 'Passenger Details';
        text = createBookingDetailsText(bookingDetails);
      } catch (error) {
        handleError(error);
      }
      break;

    case 'Booking Confirmation':
      try {
        subject = 'Your Booking has been Confirmed';
        text = ConfirmationText(userDetails);
      } catch (error) {
        handleError(error);
      }
      break;

    default:
      throw new Error('Invalid category');
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { info, otp };
  } catch (error) {
    handleError(error);
  }
};

const passengerDetails = (bookingId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT booking_id, passanger_info, pickup, pickup_address, duration FROM booking_details WHERE booking_id = ?';
    db.query(sql, [bookingId], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const bookingDetails = results[0];
        resolve(bookingDetails);
      }
    });
  });
};

const ClientDetails = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT ID, Role, First_Name, Last_Name, Mail_Id, Phone_Number, Address FROM User_Details WHERE ID = ?';
    db.query(sql, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const userDetails = results[0];
        resolve(userDetails);
      }
    });
  });
};

const createBookingDetailsText = (bookingDetails) => {
  return `
    Booking Details:
    Booking ID: ${bookingDetails.booking_id}
    Passenger Info: ${bookingDetails.passanger_info}
    Pickup: ${bookingDetails.pickup}
    Pickup Address: ${bookingDetails.pickup_address}
    Duration: ${bookingDetails.duration}
  `;
};

const ConfirmationText = (userDetails) => {
  return `
    Your booking has been confirmed successfully. Thank you!
    User Details:
    ID: ${userDetails.ID}
    Role: ${userDetails.Role}
    First Name: ${userDetails.First_Name}
    Last Name: ${userDetails.Last_Name}
    Mail Id: ${userDetails.Mail_Id}
    Phone Number: ${userDetails.Phone_Number}
    Address: ${userDetails.Address}
  `;
};

const handleError = (error) => {
  console.error('Error:', error);
  throw new Error('Failed to process email');
};

exports.sendEmail = async (req, res) => {
  const { to, otp, category, booking_id, ID } = req.body;

  try {
    emailSchema.validateAsync({ to, otp, category, booking_id, ID });

    const transporter = createTransporter();

    let userDetails = {};

    if (category === 'Passenger') {
      const bookingDetails = await passengerDetails(booking_id);
      console.log('Booking Details:', bookingDetails);
    } else if (category === 'Booking Confirmation') {
      userDetails = await ClientDetails(ID);
      console.log('User Details:', userDetails);
    }

    const result = await sendMail(transporter, to, otp, category, booking_id, userDetails);
    res.send({ success: result, message: 'Email sent successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Failed to send email' });
  }
};
