const db = require('../config/database');
const Joi = require('joi');


const Schema = Joi.object({
  Role: Joi.string(),
  First_Name: Joi.string(),
  Last_Name: Joi.string(),
  Mail_Id: Joi.string().email(),
  Phone_Number: Joi.number().integer(),
  Address: Joi.string(),
  State: Joi.string(),
  City: Joi.string(),
  Country: Joi.string(),
  is_Active: Joi.string(),
  is_Login: Joi.string(),
  is_Verify: Joi.string(),
  Password: Joi.string(),
});

exports.putUser_Details = (req, res) => {
  const ID = req.params.ID;
  const data = req.body;

  const { error } = Schema.validate(data);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }


  const setColumn = Object.keys(data).map(column => `${column} = ?`).join(', ');


  const values = [...Object.values(data), ID];

  const sql = ` UPDATE User_Details SET ${setColumn} WHERE ID = ?`;

  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "UserDetails Update Failed" });
    } else {
      res.send({ status: true, message: "UserDetails Updated successfully" });
    }
  });
};



