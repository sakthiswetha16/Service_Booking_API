const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    Category_Id: Joi.string().required(),
    Name: Joi.string().required(),
    Description: Joi.object().pattern(Joi.string().required(), Joi.string().required()),
    is_Active:Joi.string().valid('0','1').required()
  })
);

exports.categoryeditCategory =async(req, res) => {

  console.log(req.body);
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }
  const updates = req.body.map((category) => {
    const {  Name, Description,is_Active ,Category_Id} = category;
    const query = 'UPDATE Category SET Name = ?, Description = ?,is_Active=? WHERE Category_Id = ?';
    const values = [Name, JSON.stringify(Description),is_Active,Category_Id];
    return { query, values };
  });

  try {
    await Promise.all(
      updates.map(({ query, values }) => {
      return new Promise((response, reject) => {
      db.query(query, values, (error, results) => {
          if (error) {
              console.error('Database error:', error);
              reject('Invalid data');
            } else if (results.affectedRows === 0) {
              reject('No records updated');
            } else {
              response();
            }
          });
        });
      })
);

res.json({ status: true, message: 'Updates processed successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }
};