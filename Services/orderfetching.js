const { ValueType } = require('exceljs');
const db = require('../config/database');
const Joi = require('joi');

const Schema = Joi.object({
  skip: Joi.number().integer().positive(),
  take: Joi.number().integer().positive(),
  booking_id: Joi.string() // Add validation for booking_id
});

exports.ORDER = (req, res) => {
  const { error } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const { skip, take, booking_id } = req.query;
  var sql;

  if (booking_id) {
    // If booking_id is provided, fetch data for that specific booking_id
    sql = "SELECT * FROM booking_details WHERE booking_id = ?";
    db.query(sql, [booking_id], function (error, result) {
      if (error) {
        console.log("Error Connecting to DB", error);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
      } else {
        console.log(result);
        res.send({ status: true, data: result });
      }
    });
  } else {
    // If booking_id is not provided, use the existing pagination query
    sql = "SELECT * FROM booking_details ORDER BY 1 DESC LIMIT ? OFFSET ?";
    db.query(sql, [parseInt(take), parseInt(skip)], function (error, result) {
      if (error) {
        console.log("Error Connecting to DB", error);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
      } else {
        console.log(result);
        res.send({ status: true, data: result });
      }
    });
  }
};
