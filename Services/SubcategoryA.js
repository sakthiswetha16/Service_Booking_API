const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Category_Id: Joi.string().required(),
    Name: Joi.string().required(),
    Description: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    is_Active: Joi.number().integer().required()
  })
);

const generateValues = (subCategory) => {
  subCategory.Description = JSON.stringify(subCategory.Description);
  const columns = Object.keys(subCategory);
  const values = Object.values(subCategory);
  return [columns, values];
};

exports.AddSubCategoryData = async (subCategoryData) => {

  
  const { error } = schema.validate(subCategoryData);
  if (error) {
    console.log(error);
    return { status: false, message: error.details[0].message };
  }

  const values = await Promise.all(subCategoryData.map(generateValues));

  const columns = values[0][0]; 
  const sql = `INSERT INTO Sub_Category (${columns.join(',')}) VALUES ?`;

  return new Promise((success, fail) => {
    db.query(sql, [values.map((item) => item[1])], (error) => {
      if (error) {
        console.log(error);
        fail({ status: false, message: 'Subcategory Data Creation Failed' });
      } else {
        success({ status: true, message: 'Subcategory Data Creation successfully' });
      }
    });
  });
};

exports.addSubCategory = async (req, res) => {
  const result = await exports.AddSubCategoryData(req.body);

  if (result.status) {
    res.send(result);
  } else {
    res.status(400).send(result);
}
};
