import * as userModel from '../models/user';
import md5 from 'md5';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import constants from '../../config/constants';
import sendmail from '../../config/sendmail';

const KEY_HASH = constants.key_hash_pass
const MYHOST = constants.host
const TOKEN_TIME =constants.token_live_time
const PRIVATE_KEY_TOKEN = constants.key_decode_token

 const makeemailid = ()=> {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 45; i++ )//ma xac thuc co ngau nhien 45 ki tu
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const compareInfo = (olddata, newdata)=>{

   var data = {}

   if(olddata.email !== newdata.email){
      data.email = newdata.email
   }

   if(olddata.name !== newdata.name){
      data.name = newdata.name
   }

   if(olddata.phone !== newdata.phone){
      data.phone = newdata.phone
   }

   if(olddata.address !== newdata.address){
      data.address = newdata.address
   }

   return data
}

export const createUserCtrl = async (req, res) => {

    req.body.password = CryptoJS.SHA256(req.body.password).toString();
    var dataRes = {}
    try {
        if(!await userModel.checkExistedAcc(req)){
            const data = await userModel.createUser(req.body);

             var hash = {
                id: data._id,
                name: data.name,
                email: data.email,
                addres: data.address,
                phone: data.phone
            }

            var token = jwt.sign(hash, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME}),
                userid = CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString();
            dataRes = {
                id: CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString(),
                name: data.name,
                token: token
            }
             //initial sessions
            // req.session.email = data.email
            // req.session.password = data.password
            req.session.uid = data._id

            var COOKIE_LIVE_ID = 24*3600*1000*7 ;
            res.cookie('id', userid, {maxAge: COOKIE_LIVE_ID, httpOnly: false });//create cookies
            res.cookie('keepme', true, {maxAge: COOKIE_LIVE_ID});
        }else{
            dataRes.error = true
            dataRes.message = constants.error.L1003
        }

        res.send(dataRes);
        
    } catch (error) {
        throw Error(error);
    }
}

export const updateUserCtrl = async (req, res) => {

     var dataRes = {
         error: true,
         errcode: 1007,
         message: "Some error here. Please try again.",
     }

     try {

      if(req.body.type !== undefined)
      {
         if(req.body.type == "information"){
            if(req.body.infouser){
               var olddata = await userModel.checkUserLoginbyEmail(req.authenticate.email),
                   newinfo = compareInfo(olddata, req.body.infouser),
                   data = await userModel.updateUser(olddata._id, newinfo); 

                console.log(newinfo)

               dataRes.error = false
               
               var getdata = await userModel.checkUserLoginbyId(olddata._id);

               dataRes.data = {
                  id: getdata[0]._id,
                  name: getdata[0].name,
                  email: getdata[0].email,
                  address: getdata[0].address,
                  phone: getdata[0].phone
               }

                var token = jwt.sign(dataRes.data, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME}),
                    userid = CryptoJS.AES.encrypt(getdata[0]._id.toString(), KEY_HASH).toString();

                dataRes.data.token = token
                dataRes.data.id = userid
            }
         }else if(req.body.type != undefined && req.body.type == "password" 
               && req.body.new !== undefined && req.body.old !== undefined){

            const olddata = await userModel.checkUserLoginbyEmail(req.authenticate.email);
            var passwordencode =  CryptoJS.SHA256(req.body.old).toString(),
                newpassencode = CryptoJS.SHA256(req.body.new).toString()
   
            if(olddata.password == passwordencode){
               if(newpassencode != olddata.password ){
                  var getdata = await userModel.checkUserLoginbyId(olddata._id);
                  const data = await userModel.updateUser(olddata._id, {password: newpassencode}); 
                 
                  dataRes.error = false
                  dataRes.errcode = 1010
                  olddata.password = newpassencode
                  dataRes.message = "Cập nhật mật khẩu thành công."
                 
               }else{
                  dataRes.errcode = 1008
                  dataRes.message = "Mật khẩu mới bị trùng với mật khẩu cũ."
               }
            }else{
               dataRes.errcode = 1008;
               dataRes.message = "Mật khẩu cũ không chính xác. "
            }
         }
      }
   
      res.status(200).json({
         data: dataRes,
         status: 200
      });

     } catch (error){
         return Error(error)
     } 
}

export const checkUserLoginCtrl = async (req, res) => {

    try {
    
        var data, dataRes;
        if(req.headers.origin == MYHOST || req.headers.referer == MYHOST){//except all requests from my host

            if(req.body.password != undefined){//login general
                req.body.password = CryptoJS.SHA256(req.body.password).toString();
                data = await userModel.checkUserLogin(req);
            }else {//login with cookie
                if(req.cookies.id !== undefined){
                  var bytes  = CryptoJS.AES.decrypt(req.cookies.id, KEY_HASH);
                  var deid = bytes.toString(CryptoJS.enc.Utf8);
                  data = await userModel.checkUserLoginbyId(deid);
                }else{
                    res.send({});
                }
            }
            if(typeof data != 'boolean'){
                var hash = {
                    id: data[0]._id,
                    name: data[0].name,
                    email:  data[0].email,
                    addres: data[0].address,
                    phone: data[0].phone
                }
                
                var token = jwt.sign(hash, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME}),
                    userid = CryptoJS.AES.encrypt(data[0]._id.toString(), KEY_HASH).toString();

                dataRes = {
                    id: userid,
                    name: data[0].name,
                    token: token
                }
                //initial sessions
                // req.session.email = data[0].email
                // req.session.password = data[0].password
                 req.session.uid = data[0]._id
                 var COOKIE_LIVE_ID =  24*3600*1000*7;
                 res.cookie('id', userid, {maxAge: COOKIE_LIVE_ID, httpOnly: false });//create cookies
                 res.cookie('keepme', true, {maxAge: COOKIE_LIVE_ID});
            }else{
                dataRes = {
                    status: "error",
                    message: constants.error.L1006
                }
            }

            res.send(dataRes);
        }

    } catch (error) {
        throw Error(error);
    }
}

//keep state login of user
export const keepStateLogin = async (req, res) => {

    try {
        var data = req.authenticate
       
         const dataRes = {
            id: CryptoJS.AES.encrypt(data.id.toString(), KEY_HASH).toString(),
            name: data.name
        }

        res.send(dataRes);
    } catch (error) {
        throw Error(error);
    }
}

export const checkUserLogoutCtrl = async (req, res) => {

    req.body.logout = req.body.logout;
    try {
        //destroy sessions
        req.session.destroy()
        res.send({logout : true});
    } catch (error) {
        throw Error(error);
    }
}

export const checkExistedAc = async (req, res) => {

    try {
        var dataRes = {
            error : true,
            message: constants.error.L1003
        }
        const data = await userModel.checkExistedAcc(req)
    
        if(!data){
            dataRes.error = false
            dataRes.message = constants.error.L1004
        }
        res.send(dataRes);
    } catch (error) {
        throw Error(error);
    }
    
}

export const authenticateEmail = async(req, res) =>{

    try{

        var dataRes = {
            error : false,
            message: constants.success.A1002
        }

        if(req.session.emailcode != req.body.authenemail){
            dataRes.error = true;
            dataRes.message = constants.error.L1001  
        }
        res.send(dataRes)
    }catch(error){
        throw Error(error)
    }
    
}

export const sendAuthenticateEmail = async(req, res)=>{

    req.session.emailcode = makeemailid()
   
    try{ 
       
       await sendmail.sendEmailCode(req.body.email, req.session.emailcode, 0, 
         (err, data) =>{
            if(err)  return err;
            else{
               res.send({message: constants.success.A1001})
            }
        })

    }catch(error){
        throw Error(error)
    }
}

export const getUserInfo = async(req, res)=>{
    //getUserinfor by post
   try{

      var dataRes = {
         status: "error",
         message: constants.error.L1006
      }, 
      data = req.authenticate
    //  console.log(data)
      if(req.query.id == undefined || req.query.id == null){
         var userinfo;
         dataRes = {
            id: CryptoJS.AES.encrypt(data.id.toString(), KEY_HASH).toString(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.addres
         }

      }else{//by get
         dataRes = await userModel.checkUserLoginbyId(data.id);
      }

      res.json(dataRes)

   }catch (error) {
      throw Error(error);
   }
}

// export const LoginAPI = async(req, res)=>{

//   if(req.body.key == constants.lgAPI.fb)
//     res.redirect('/user/auth/facebook')
//   else
//     res.redirect('/user/auth/google')
// }

export const loginWithFacebook = async(req, res)=>{

   try{
      var dataRes = {
        error : false,
        message: constants.error.L1008
      }
      res.json(dataRes)

   }catch (error) {
      throw Error(error);
   }

}

export const loginWithGoogle = async(req, res)=>{

   try{

      var dataRes = {
        error : false,
        message: constants.error.L1008
      }, data

      req.body.email = req.user.emails[0].value
     
      //check email/id is existed
      if(!await userModel.checkExistedAcc(req)){

          var User = {
            name: req.user.displayName,
            email: req.user.emails[0].value,
            avatar: req.user.photos[0].value,
            api_type: req.user.provider,
            phone: "",
            address: "",
            gender: req.user.gender
          }

         data = await userModel.createUser(User);
          
      }else{
         data = await userModel.checkUserLoginbyEmail(req.body.email);
         if(data.api_type != constants.lgAPI.gg)
            res.json(dataRes)

      }
      
      var hash = {
         id: data._id,
         name: data.name,
         email: data.email,
         addres: data.address,
         phone: data.phone,
         avatar: data.avatar
      }

      var token = jwt.sign(hash, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME}),
         userid = CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString();
      dataRes = {
         id: CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString(),
         name: data.name,
         token: token
      }
      req.session.uid = data._id

      var COOKIE_LIVE_ID = 24*3600*1000*7 ;
      res.cookie('id', userid, {maxAge: COOKIE_LIVE_ID, httpOnly: false });//create cookies
      res.cookie('keepme', true, {maxAge: COOKIE_LIVE_ID});
      res.redirect('/')
   }catch (error) {
      throw Error(error);
   }

}