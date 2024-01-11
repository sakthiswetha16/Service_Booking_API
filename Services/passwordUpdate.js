const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.object({
  Mail_Id: Joi.string().email().required(),
  OTP:Joi.string().required(),
  Role:Joi.string().required()
});

exports.PasswordUser_Details = (req, res) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const {Password } = req.body;
  const {Mail_Id,OTP,Role} = req.params;

  const Query = 'UPDATE User_Details SET  Password = ? WHERE Mail_Id = ? AND OTP = ? AND Role = ?';
  const Values = [Password,Mail_Id,OTP,Role];



 console.log(Query,Values);
    db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
       return res.status(500).json({ status: false, message: 'Invalid OTP' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Invalid OTP' });
      }
  
      res.json({ status: true, message: 'Password Reset Successfully', OTP });
    }
    )};





