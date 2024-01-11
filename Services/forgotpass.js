const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.object({
  Mail_Id: Joi.string().email().required(),
  Role:Joi.string().required()
});

exports.forgotpasswordUser_Details = (req, res) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  // const {is_Verify } = req.body;
  const {Mail_Id} = req.params;
  const {Role} = req.params;
  const OTP = generateOTP();

  const Query = 'UPDATE User_Details SET OTP = ? WHERE Mail_Id = ? AND Role = ? AND is_Verify="Yes"';
  const Values = [OTP,Mail_Id,Role];



 console.log(Query,Values);
    db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ status: false, message: 'Error To Connet' });
      } 
       if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Invalid User_Id' });
       }
        res.json({ status: true, message: 'OTP Sent successfully', OTP });
      }
    )};


// OTP GENERATION
const generateOTP = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};


