const pdf = require('html-pdf');
const db = require('../config/database');
const Joi = require('joi');

const Schema = Joi.object({
  booking_id: Joi.string().required(),
});

exports.GeneratePDF = async (req, res) => {
  const { error } = Schema.validate(req.query);

  if (error) {
    return res.status(400).send({ status: false, message: error.details[0].message });
  }

  const { booking_id } = req.query;

  const bookingDetailsSql = "SELECT * FROM booking_details WHERE booking_id = ?";
  db.query(bookingDetailsSql, [booking_id], (error, bookingDetailsResult) => {
    if (error) {
      console.error("Error:", error);
      return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }

    const bookingDetails = bookingDetailsResult[0];

    if (bookingDetails) {
      const { user_id, emp_id, product_id } = bookingDetails;

      const userSql = "SELECT * FROM User_Details WHERE ID = ?";
      db.query(userSql, [user_id], (error, userResult) => {
        if (error) {
          console.error("Error:", error);
          return res.status(500).send({ status: false, message: 'Internal Server Error' });
        }

        const user = userResult[0];


        const employeeSql = "SELECT * FROM User_Details WHERE ID = ?";
        db.query(employeeSql, [emp_id], (error, employeeResult) => {
          if (error) {
            console.error("Error:", error);
            return res.status(500).send({ status: false, message: 'Internal Server Error' });
          }

          const employee = employeeResult[0];

          const productSql = "SELECT * FROM Product WHERE ID = ?";
          db.query(productSql, [product_id], (error, productResult) => {
            if (error) {
              console.error("Error:", error);
              return res.status(500).send({ status: false, message: 'Internal Server Error' });
            }

            const product = productResult[0];





            console.log('Booking Details:', bookingDetails);
            console.log('User Details:', user);
            console.log('Employee Details:', employee);
            console.log('Product Details:', product);

            const travelled_km = bookingDetails.travelled_km || 0;
            const waiting_hours = bookingDetails.waiting_hours || 0;




            const waitingCost = 3 * waiting_hours;
            const travelledCost = 10 * travelled_km;
            const totalCost = waitingCost + travelledCost;
            const gst = 18.01 * totalCost;

            const passangerInfo = JSON.parse(bookingDetails.passanger_info);

            const htmlContent = `
    <div style="text-align: center; font-size: large;">
      <h1>INVOICE</h1>
    </div>
    <div style="text-align: justify;">
      <h2>Booking Details</h2>
      <h4>
        <p>Booking ID: ${bookingDetails.booking_id}</p>
      <p>Passenger Name: ${passangerInfo.Name}</p>
      <p>Passenger Email: ${passangerInfo.email}</p>
      <p>Passenger Contact: ${passangerInfo.contact}</p>
        <p>Pickup: ${bookingDetails.pickup}</p>
        <p>Pickup Address: ${bookingDetails.pickup_address}</p>
        <p>Duration: ${bookingDetails.duration}</p>
      </h4>
    </div>
    <div style="text-align: justify; ">
      <h2>User Details</h2>
      <h4>
        <p>User ID: ${user.ID}</p>
        <p>User Name: ${user.First_Name}</p>
        <p>Mail_Id: ${user.Mail_Id}</p>
        <p>Contactnumber: ${user.Phone_Number}</p>
      </h4>
    </div>
    <div style="text-align: justify; ">
      <h2>Driver Details</h2>
      <h4>
        <p>Employee ID: ${employee.ID}</p>
        <p>Name: ${employee.First_Name}</p>
        <p>Mail_Id: ${employee.Mail_Id}</p>
        <p>Contactnumber: ${employee.Phone_Number}</p>
      </h4>
    </div>
    <div style="text-align: justify; ">
      <h2>Product Details</h2>
      <h4>
        <p>Product ID: ${product.Product_Id}</p>
        <p>Product Name: ${product.Name}</p>
        <p>Trip_start: ${product.Trip_start}</p>
        <p>Trip_end: ${product.Trip_end}</p>
      </h4>
    </div>
    <div style="text-align: justify; ">
      <h2>Travelled Detail & Total Cost</h2>
      <h4>
        <p>Waiting Hours: ${bookingDetails.waiting_hours}</p>
        <p>Travelled Km: ${bookingDetails.travelled_km}</p>
        <p>Waiting Cost: ${waitingCost}</p>
        <p>Travelled Cost: ${travelledCost}</p>
        <p>Total Cost: ${totalCost}</p>
        <p>-------------------------------------</p>
        <p>GST (18%): ${gst}</p>
        <p>-------------------------------------</p>
      </h4>
    </div>
    <div style="text-align: right; margin-bottom: 20px;">
      <p>Invoice Gendrated On: ${bookingDetails.trip_end}</p>
    </div>
  `;
            const options = {
              format: 'Letter',
            };

            pdf.create(htmlContent, options).toBuffer((err, buffer) => {
              if (err) {
                console.error("Error:", err);
                return res.status(500).send({ status: false, message: 'Internal Server Error' });
              }

              const currentDate = new Date().toISOString().replace(/:/g, "-");

              const pdfFileName = `${currentDate}_invoice.pdf`;

              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `inline; filename=${pdfFileName}`);
              res.status(200).send(buffer);
            });
          });
        });
      });
    }

    else {

      return res.status(404).json({
        status: false,
        message: 'Booking details not found or missing user_id',
        error: { booking_id },
      });
    }
  });
};