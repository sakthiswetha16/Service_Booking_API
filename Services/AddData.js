const db = require('../config/database');

const Joi=require('joi');


const schema = Joi.object({
  Role: Joi.string().required(),
  First_Name: Joi.string().required(),
  Last_Name: Joi.string().required(),
  Mail_Id: Joi.string().email().required(),
  Phone_Number: Joi.string().required(),
  Address: Joi.string().required(),
  State: Joi.string().required(),
  City: Joi.string().required(),
  Country: Joi.string().required(),
  is_Active: Joi.string(),
  is_Login: Joi.string(),
  is_Verify: Joi.string(),
  Password: Joi.string(),
  OTP: Joi.string(),
});

exports.addUser_Details = (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }


const data=req.body;

const columns = Object.keys(data);
  const values = Object.values(data);

  const sql = `INSERT INTO User_Details (${columns.join(', ')}) VALUES (${values.map(() => `?`).join(', ')})`;

  
  console.log(sql);



db.query(sql, values, (error) => {
  if (error) {
    console.log(error)
    res.send({ status: false, message: "User Data Creation Failed" });
  } else {
    
    res.send({ status: true, message: "User Data Creation successfully" });
  }
});
};