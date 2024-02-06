const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.object({
  Mail_Id: Joi.string().email().required(),
  OTP:Joi.string().required()
});

exports.OTPUser_Details = (req, res) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const {Mail_Id} = req.params;
  const {OTP} = req.params;

  const Query = 'UPDATE User_Details SET  is_Verify ="Yes" WHERE Mail_Id = ? AND OTP = ?';
  const Values = [Mail_Id,OTP ];



 console.log(Query,Values);
    db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ status: false});
      } 
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Invalid OTP' });
      }
        res.json({ status: true, message: 'OTP Verified Successfully', OTP });
      }
    )};





