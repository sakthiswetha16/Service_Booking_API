const express = require('express');
const router = express.Router();
const AddData = require('../Services/AddData');
const UpdateData = require('../Services/UpdateData');
const DeleteData= require('../Services/DeleteData');
const ViewData= require('../Services/ViewData');
const OTPgendrate= require('../Services/OTPgendrate');
const nodeMailer=require('../Services/Mail')
const OTPverification= require('../Services/OTPverification');
const forgotpass=require('../Services/forgotpass')
const passwordUpdate=require('../Services/passwordUpdate')
const Signin=require('../Services/Signin')
const Logout=require('../Services/Logout')
const Categoryadd=require('../Services/Categoryadd')
const bulkeditCategory=require('../Services/CategoryEdit')
const bulkdeletcategory=require('../Services/CategoryDelete')
const SubCategory=require('../Services/SubcategoryA')
const SubcategoryE=require('../Services/SubcategoryE')
const SubcategoryD=require('../Services/SubcategoryD')
const ProductA=require('../Services/ProductA')
const ProductE=require('../Services/ProductE')
const ProductD=require('../Services/ProductD')
const fileUpload=require('../Services/fileUpload')



router.post('/add',AddData.addUser_Details);
router.put('/update/:ID',UpdateData.putUser_Details);
router.delete('/delete/:ID',DeleteData.deleteUser_Details);
router.get('/view',ViewData.ViewUser_Details);
router.put('/otp/:Mail_Id',OTPgendrate.otpUser_Details);
router.post('/mailsend',nodeMailer.sendEmail);
router.put('/OTP/:Mail_Id/:OTP',OTPverification.OTPUser_Details);
router.put('/forgotpass/:Mail_Id/:Role',forgotpass.forgotpasswordUser_Details)
router.put('/Password/:Mail_Id/:OTP/:Role',passwordUpdate.PasswordUser_Details)
router.put('/signin/:Mail_Id/:Role/:Password',Signin.SigninUser_Details)
router.put('/logout/:Mail_Id/:Password',Logout.LogoutUser_Details)
router.post('/CategoryAdd',Categoryadd.addCategory)
router.put('/Categoryedit',bulkeditCategory.categoryeditCategory)
router.put('/Categorydelet',bulkdeletcategory.CategoryedeletCategory)
router.post('/SubCategoryAdd',SubCategory.addSubCategory)
router.put('/subCategoryedit',SubcategoryE.Subcategorye)
router.put('/subCategorydelet',SubcategoryD.Subcategoryd)
router.post('/AddProduct',ProductA.addProduct)
router.put('/EditProduct',ProductE.Producte)
router.put('/DeleteProduct',ProductD.Productd)
router.post('/Uploadfile', fileUpload.productfile)



module.exports = router;