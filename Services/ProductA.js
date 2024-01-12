const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Category_Id: Joi.string().required(),
    subCategory_Id: Joi.string().required(),
    Product_Id: Joi.string(),
    Name: Joi.string().required(),
    From:Joi.string().required(),
    To:Joi.string().required(),
    Description: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    is_Active: Joi.number().integer().required()
  })
);

exports.addProduct = (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const values = req.body.map(({ Category_Id,subCategory_Id,Product_Id,Name,From,To, Description, is_Active }) => {
    const generatedID = Product_Id || RandomPin();
    return [Category_Id,subCategory_Id, generatedID, Name,From,To, JSON.stringify(Description), is_Active];
  });

  const sql = (`INSERT INTO Product (Category_Id,subCategory_ID,Product_Id,Name,\`From\`,\`To\`, Description, is_Active) VALUES ?`);

  console.log(sql, values);

  db.query(sql, [values], (error) => {
    if (error) {
      console.log(error);
      res.send({ status: false, message: "Product Data Creation Failed" });
    } else {
      res.send({ status: true, message: "Product Data Creation successfully" });
    }
  });
};

function RandomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
