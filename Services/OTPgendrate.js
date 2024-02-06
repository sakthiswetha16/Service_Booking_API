const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.object({
  Mail_Id: Joi.string().email().required(),
});

exports.otpUser_Details = (req, res) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  
  const {Mail_Id } = req.params;
  const OTP = generateOTP();


  const Query = 'UPDATE User_Details SET is_Active = "Yes", OTP = ? WHERE Mail_Id = ?';
  const Values = [OTP, Mail_Id];

  db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ status: false, message: 'Error To Connect' });
      } if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Error To Gendrate' });
      }
  
      res.json({ status: true, message: 'Account Created Successfully', OTP });
    }
    )};




// OTP GENERATION
const generateOTP = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};