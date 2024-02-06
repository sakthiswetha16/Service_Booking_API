const { ValueType } = require('exceljs');
const db = require('../config/database');
const Joi=require('joi');

const Schema = Joi.object({
  skip: Joi.number().integer().positive().required(),
  take: Joi.number().integer().positive().required(),
});

exports.ViewUser_Details = (req, res) => {

  const { error } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

    var is_Login  
    const { skip, take } = req.query; 
    var sql = "SELECT * FROM User_Details ORDER BY 1 DESC LIMIT ? OFFSET ?";
    console.log(is_Login);

    db.query(sql, [parseInt(take), parseInt(skip)], function (error, result) {

      if (error) {
        console.log("Error Connecting to DB",error);
      } else {
        console.log(result)
        res.send({ status: true, data: result });
      }
    });
  };