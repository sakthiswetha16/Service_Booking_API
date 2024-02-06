const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const { AddData } = require('../Services/ProductA');
const { EditData } = require('../Services/ProductE');
const { deleteData } = require('../Services/ProductD');

const upload = multer({ dest: '/Uploadfile' }).single('csvFile');
exports.uploads = upload;

exports.productfile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file', details: err.message });
    }

    console.log('request file:', req.file);
    const filePath = req.file.path;
    const csvReadStream = fs.createReadStream(filePath).pipe(csvParser());
    const rows = [];

    csvReadStream
      
    
    .on('data', (row) => {
        console.log('csvrow', row);
        rows.push(row);
      })
      
      
      
      
      .on('end', async () => {

  try {
    const results = {
      Add: { Success: 0, fail: 0 },
      Edit: { Success: 0, fail: 0 },
      Delete: { Success: 0, fail: 0 },
      Total: { Success: 0, fail: 0 }};

      
    for (const Product of rows) {
      const status = Product.status;

      try {
        if (status === 'A') {
          await addProductData(Product);
          results.Add.Success++;
          results.Total.Success++;
        } else if (status === 'E') {
          await editProductData(Product);
          results.Edit.Success++;
          results.Total.Success++;
        } else if (status === 'D') {
          await deleteProductData(Product);
          results.Delete.Success++;
          results.Total.Success++;
        }
      } catch (error) {
        console.error('Error processing product:', error);
        if (status === 'A') {
          results.Add.fail++;
          results.Total.fail++;
        } else if (status === 'E') {
          results.Edit.fail++;
          results.Total.fail++;
        } else if (status === 'D') {
          results.Delete.fail++;
          results.Total.fail++;
        }
      }
    }

    const response = {
      status: true,
      message: 'File uploaded and processed successfully.',
      results,
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

  });
};




async function addProductData(Product) {
  const productData = {
    Category_Id: Product.Category_Id,
    Subcategory_Id: Product.Subcategory_Id,
    Product_Id: Product.Product_Id,
    Name: Product.Name,
    Trip_start: Product.Trip_start,
    Trip_end: Product.Trip_end,
    Description: {
      [Product.query]: Product.suggestions,
    },
    is_Active: Product.is_Active,
  };

  await AddData([productData]);
}

async function editProductData(Product) {
  try{
    const productData = {
    Category_Id: Product.Category_Id,
    Subcategory_Id: Product.Subcategory_Id,
    Product_Id: Product.Product_Id,
    Name: Product.Name,
    Trip_start: Product.Trip_start,
    Trip_end: Product.Trip_end,
    Description: {
      [Product.query]: Product.suggestions,
    },
    is_Active: Product.is_Active,
  };

  await EditData([productData ]);
  console.log('data edited ');
}
catch(error){
  console.log(error);
}
}

async function deleteProductData(Product) {
  await deleteData([{ Product_Id: Product.Product_Id, Name: Product.Name }]);
}
