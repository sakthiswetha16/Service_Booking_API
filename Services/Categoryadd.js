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
    return res.status(400).send({ status: false, message: error.details[0].message });
  }


const valuesArray = req.body.map(({ Name, Description, is_Active }) => [
  Name,
  JSON.stringify(Description),
  is_Active
]);

  const sql = `INSERT INTO Category ( Name, Description, is_Active) VALUES ?`;

  
  console.log(sql,valuesArray);



db.query(sql, [valuesArray], (error) => {
  if (error) {
    console.log(error)
    res.send({ status: false, message: "User Data Creation Failed" });
  } else {
    
    res.send({ status: true, message: "User Data Creation successfully" });
  }
});
};

