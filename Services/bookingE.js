const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
    Joi.object({
      booking_id: Joi.string(),
      passanger_info:Joi.object().pattern(Joi.string(), Joi.string()),
      pickup: Joi.string(),
      pickup_address: Joi.string(),
      duration: Joi.string(),
      otp: Joi.string(),
      status: Joi.string(),
      emp_id: Joi.string(),
      user_id: Joi.string(),
      product_id: Joi.string(),
      waiting_hours: Joi.string(),
      travelled_km: Joi.string()
    })
)

exports.Editbooking = async (bookingUpdates) => {
  const { error } = schema.validate(bookingUpdates);
  if (error) {
    console.log(error);
    return { status: false, message: error.details[0].message };
  }

  const updates = bookingUpdates.map((bookingdata) => {
    const { booking_id, ...updateFields } = bookingdata;
    const query = `UPDATE booking_details SET ? WHERE booking_id = ?`;
    const updateValues = { ...updateFields };
    const values = [updateValues, booking_id];
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

exports.bookinge = async (req, res) => {
  const result = await exports.Editbooking(req.body);

  if (result.status) {
    res.json(result);
  } else {
    res.status(400).json(result);
}
};
