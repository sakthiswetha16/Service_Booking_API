const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Name: Joi.string().required(),
    Description: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    is_Active: Joi.number().integer().required()
  })
);

exports.addCategory = (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const valuesArray = req.body.map((category) => {
    category.Description = JSON.stringify(category.Description);
    const columns = Object.keys(category);
    const values = Object.values(category);
    return [columns, values];
  });

  const columns = valuesArray[0][0]; 
  const sql = `INSERT INTO Category (${columns.join(',')}) VALUES ?`;

  const formattedValues = valuesArray.map((item) => item[1]);

  console.log(sql, formattedValues);

  db.query(sql, [formattedValues], (error) => {
    if (error) {
      console.error(error);
      res.send({ status: false, message: "User Data Creation Failed" });
    } else {
      res.send({ status: true, message: "User Data Creation successfully" });
    }
  });
};
