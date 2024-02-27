const { ValueType } = require('exceljs');
const db = require('../config/database');
const Joi = require('joi');

const Schema = Joi.object({
  skip: Joi.number().integer().positive(),
  take: Joi.number().integer().positive(),
  ID: Joi.string()
});

exports.statusFetching = (req, res) => {
  const { error } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const { skip, take, ID } = req.query;
  var sql;

  if (ID) {
    sql = "SELECT * FROM status WHERE ID = ?";
    db.query(sql, [ID], function (error, result) {
      if (error) {
        console.log("Error Connecting to DB", error);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
      } else {
        console.log(result);
        res.send({ status: true, data: result });
      }
    });
  } else {
    sql = "SELECT * FROM  status ORDER BY 1 DESC LIMIT ? OFFSET ?";
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
