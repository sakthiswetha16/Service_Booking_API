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

exports.EditData = async (productUpdates) => {
  const { error } = schema.validate(productUpdates);
  if (error) {
    console.log(error);
    return { status: false, message: error.details[0].message };
  }

  const updates = productUpdates.map((Productdata) => {
    const { Product_Id, ...updateFields } = Productdata;
    const query = `UPDATE Product SET ? WHERE Product_Id = ?`;
    const updateValues = { ...updateFields, Description: JSON.stringify(Productdata.Description) };
    const values = [updateValues, Product_Id];
    console.log(query);
    console.log(values);
    return { query, values };
  });

  try {
    await Promise.all(
      updates.map(({ query, values }) => {
        return new Promise((resolve, reject) => {
          db.query(query, values, (error, results) => {
            if (error) {
              console.error('Database error:', error);
              reject('Invalid data');
            } else if (results.affectedRows === 0) {
              reject('No records updated');
            } else {
              resolve();
            }
          });
        });
      })
    );

    return { status: true, message: 'Updates processed successfully' };
  } catch (error) {
    return { status: false, message: error };
  }
};

exports.Producte = async (req, res) => {
  const result = await exports.EditData(req.body);

  if (result.status) {
    res.json(result);
  } else {
    res.status(400).json(result);
}
};
