const db = require('../config/database');
const Joi=require('joi');

const Schema = Joi.object({
  ID: Joi.number().integer().positive().required(),
});


exports.deleteUser_Details = (req, res) => {

  const { error } = Schema.validate(req.params);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }


let sql = "DELETE FROM User_Details WHERE id=" + req.params.ID + "";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, message: "User_Details Deleted Failed" });
      } else {
        res.send({ status: true, message: "User_Details Deleted successfully" });
      }
    });
  };