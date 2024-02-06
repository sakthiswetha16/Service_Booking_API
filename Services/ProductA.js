const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Category_Id: Joi.string().required(),
    Subcategory_Id: Joi.string().required(),
    Product_Id: Joi.string(),
    Name: Joi.string().required(),
    Trip_start: Joi.string().required(),
    Trip_end: Joi.string().required(),
    Description: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    is_Active: Joi.string().valid('0', '1').required()
  })
);

const RandomPin = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateValues = (product) => {
  if (product.Product_Id === undefined) {
    product.Product_Id = RandomPin();
  }
  product.Description = JSON.stringify(product.Description);
  return [
    product.Category_Id,
    product.Subcategory_Id,
    product.Product_Id,
    product.Name,
    product.Trip_start,
    product.Trip_end,
    product.Description,
    product.is_Active
  ];
};

exports.AddData = async (productData) => {

  const { error } = schema.validate(productData);
  if (error) {
    // console.log('ASDFGHJKLkl',error);
    return { status: false, message: error.details[0].message };
  }

  const values = await Promise.all(productData.map(generateValues));
  

console.log(values);


console.log('asdfghj');
  const columns = ['Category_Id', 'Subcategory_Id', 'Product_Id', 'Name', 'Trip_start', 'Trip_end', 'Description', 'is_Active'];
  const sql = `INSERT INTO Product (${columns.join(',')}) VALUES ?`;
  console.log(sql);
  console.log(columns,values);
  return new Promise((resolve, reject) => {
    db.query(sql, [values], (error) => {
      if (error) {
        console.error(error);
        reject({ status: false, message: 'Product Data Creation Failed' });
      } else {
        resolve({ status: true, message: 'Product Data Creation successfully' });
      }
    });
  });
};

exports.addProduct = async (req, res) => {
  const result = await exports.AddData(req.body);

  if (result.status) {
    res.send(result);
  } else {
    res.status(400).send(result);
}
};
