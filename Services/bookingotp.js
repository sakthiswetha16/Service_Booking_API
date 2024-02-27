const db = require('../config/database');
const Joi = require('joi');

// const schema = Joi.array().items(
    const schema = Joi.object({
  booking_id: Joi.string().required(),
  otp:Joi.string().required()
})
// );

exports.OTPbooking = (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const {booking_id} = req.body;
  const {otp} = req.body;

  const Query = 'UPDATE booking_details SET  status ="3" WHERE booking_id= ? AND otp= ?';
  const Values = [booking_id,otp ];



 console.log(Query,Values);
    db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ status: false});
      } 
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Invalid OTP' });
      }
        res.json({ status: true, message: 'OTP Verified Successfully',otp });
      }
    )};





