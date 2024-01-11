const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.object({
  Mail_Id: Joi.string().email().required(),
  Password:Joi.string().required()
});

exports.LogoutUser_Details = (req, res) => {
  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }


  const {Mail_Id,Password} = req.params;


  const Query = 'UPDATE User_Details SET  is_Login ="No" WHERE Mail_Id = ? AND Password = ?';
  const Values = [Mail_Id,Password];



 console.log(Query,Values);
    db.query(Query, Values, (error,result) => {
      if (error) {
        console.error('Database error:', error);
       return res.status(500).json({ status: false, message: 'Invalid OTP' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: false, message: 'Invalid Password or Id' });
      }
  
      res.json({ status: true, message: 'Logout Successfully'});
    }
    )};





