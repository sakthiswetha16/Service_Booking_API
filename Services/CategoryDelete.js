const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Name: Joi.string().required(),
    Category_Id: Joi.string().required()
  })
);

exports.CategoryedeletCategory = async (req, res) => {
  console.log(req.body);
 const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const updates = req.body.map((category) => {
    const { Name, Category_Id } = category;
    const query = 'UPDATE Category SET is_Active="0" WHERE Name = ? AND Category_Id = ?';
    const values = [Name, Category_Id];

    

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
  });

  try {
    const results = await Promise.all(updates);
    if (results.affectedRows === 0) {
      return res.status(404).json({ status: false, message: 'No records updated' });
    }

    res.json({ status: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};