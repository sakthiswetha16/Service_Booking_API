const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Category_Id: Joi.string().required(),
    subCategory_Id: Joi.string().required(),
    Name: Joi.string().required(),
    Description: Joi.object().pattern(Joi.string().required(), Joi.string().required()),
    is_Active: Joi.string().valid('0', '1').required()
  })
);

exports.Subcategorye = async (req, res) => {

  console.log(req.body);
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }
  const updates = req.body.map((subcategory) => {
    const { subCategory_Id, ...updateFields } = subcategory;

    const query = `UPDATE Sub_Category SET ? WHERE subCategory_Id = ?`;
    const updateValues = { ...updateFields, Description: JSON.stringify(subcategory.Description) };

    const values = [updateValues, subCategory_Id];
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

    res.json({ status: true, message: 'Updates processed successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }
};