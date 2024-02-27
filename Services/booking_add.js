const db = require('../config/database');
const Joi = require('joi');

const schema = Joi.array().items(
  Joi.object({
    booking_id: Joi.string(),
    passanger_info:Joi.object().pattern(Joi.string(), Joi.string()).required(),
    pickup: Joi.string().required(),
    pickup_address: Joi.string().required(),
    duration: Joi.string().required(),
    otp: Joi.string(),
    status: Joi.string().required(),
    emp_id: Joi.string(),
    user_id: Joi.string(),
    product_id: Joi.string(),
    waiting_hours: Joi.string(),
    travelled_km: Joi.string()
  })
);

const RandomPin = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateValues = (booking_details) => {
  
    booking_details.booking_id = RandomPin();
    booking_details.otp = RandomPin();
  booking_details.passanger_info = JSON.stringify(booking_details.passanger_info);
  return [
    booking_details. booking_id,
    booking_details.passanger_info,
    booking_details.pickup,
    booking_details.pickup_address,
    booking_details.duration,
    booking_details.otp,
    booking_details.status,
    booking_details.emp_id,
    booking_details.user_id,
    booking_details.product_id,
    booking_details.waiting_hours,
    booking_details.travelled_km
  ];
};

exports.bookingdetails = async (bookingdata) => {

  const { error } = schema.validate(bookingdata);
  if (error) {
    // console.log('ASDFGHJKLkl',error);
    return { status: false, message: error.details[0].message };
  }

  const values = await Promise.all(bookingdata.map(generateValues));
  

console.log(values);


console.log('asdfghj');
  const columns = ['booking_id', 'passanger_info', 'pickup', 'pickup_address', 'duration', 'otp','status', 'emp_id', 'user_id' ,'product_id','waiting_hours','travelled_km'];
  const sql = `INSERT INTO booking_details (${columns.join(',')}) VALUES ?`;
  console.log(sql);
  console.log(columns,values);
  return new Promise((resolve, reject) => {
    db.query(sql, [values], (error) => {
      if (error) {
        console.error(error);
        reject({ status: false, message: 'Product Data Creation Failed' });
      } else {
        resolve({ status: true, message: 'Product Data Creation successfully' });
      }
    });
  });
};

exports.addbooking = async (req, res) => {
  const result = await exports.bookingdetails(req.body);

  if (result.status) {
    res.send(result);
  } else {
    res.status(400).send(result);
}
};
