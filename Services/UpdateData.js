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

  const sql =` UPDATE User_Details SET ${setColumn} WHERE ID = ?`;

  db.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "UserDetails Update Failed" });
    } else {
      res.send({ status: true, message: "UserDetails Updated successfully" });
    }
  });
};





      // req.body.Role +
      // "', First_Name='" +
      // req.body.First_Name +
      // "',Last_Name='" +
      // req.body.Last_Name +
      // "',Mail_Id='" +
      // req.body.Mail_Id +
      // "',Phone_Number='" +
      // req.body.Phone_Number +
      // "',Address='" +
      // req.body.Address+
      // "',State='" +
      // req.body.State +
      // "',City='" +
      // req.body.City +
      // "',Country='" +
      // req.body.Country +
      // "',is_Active='" +
      // req.body.is_Active +
      // "',is_Login='" +
      // req.body.is_Login +
      // "',is_Verify='" +
      // req.body.is_Verify +
      // "',Password='" +
      // req.body.password +
      // "'  WHERE ID=" +
      // req.params.ID;
  