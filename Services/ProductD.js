const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Name: Joi.string().required(),
    Product_Id: Joi.string().required()
  })
);

// Main function
exports.deleteData = async (categories) => {
  try {
    const results = await Promise.all(
      categories.map(async (category) => {
        const { Name, Product_Id } = category;
        const query = 'UPDATE Product SET is_Active="0" WHERE Name = ? AND Product_Id = ?';
        const values = [Name, Product_Id];

        return new Promise((resolve, reject) => {
          db.query(query, values, (error, result) => {
            if (error) {
              console.error('Database error:', error);
              reject({ error, message: 'Database error' });
            } else {
              resolve(result);
            }
          });
        });
      })
    );

    if (results.some((result) => result.affectedRows === 0)) {
      return { status: false, message: 'No records updated (ID mismatch)' };
    }

    return { status: true, message: 'Updated successfully' };
  } catch (error) {
    console.error('Database error:', error);
    return { status: false, message: 'Internal Server Error' };
  }
};

// API call
exports.Productd = async (req, res) => {
  console.log('Request body:', req.body);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  try {
    const results = await exports.deleteData(req.body);
    console.log('Response :', results);
    res.json(results);
  } catch (error) {
    console.error('Error processing :', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};
