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

export const createUserCtrl = async (req, res) => {

    req.body.password = CryptoJS.SHA256(req.body.password).toString();

    try {

        if(!await userModel.checkExistedAcc(req)){

            const data = await userModel.createUser(req.body);
            
            console.log(data)

             var hash = {
                id: data._id,
                name: data.name,
                email: data.email,
                addres: data.address,
                phone: data.phone
            }
                 
            var token = jwt.sign(hash, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME});

            const dataRes = {
                id: CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString(),
                name: data.name,
                token: token
            }

             //initial sessions
            // req.session.email = data.email
            // req.session.password = data.password
            req.session.uid = data._id
            res.send(dataRes);
        }else{
              res.send(dataRes);
        }
        
    } catch (error) {
        throw Error(error);
    }
}

export const checkUserLoginCtrl = async (req, res) => {

    try {
    
        var data;
        if(req.headers.origin == MYHOST || req.headers.referer == MYHOST){//except all requests from my host

            if(req.body.password != undefined){
                req.body.password = CryptoJS.SHA256(req.body.password).toString();
                data = await userModel.checkUserLogin(req);
            }else {

                var bytes  = CryptoJS.AES.decrypt(req.body.id, KEY_HASH);
                var deid = bytes.toString(CryptoJS.enc.Utf8);
                data = await userModel.checkUserLoginbyId(deid);
            }

            if(typeof data != 'boolean'){
                var hash = {
                    id: data[0]._id,
                    name: data[0].name,
                    email:  data[0].email,
                    addres: data[0].address,
                    phone: data[0].phone
                }
                
                var token = jwt.sign(hash, PRIVATE_KEY_TOKEN, {algorithm: 'HS256', expiresIn: TOKEN_TIME});

                const dataRes = {
                    id: CryptoJS.AES.encrypt(data[0]._id.toString(), KEY_HASH).toString(),
                    name: data[0].name,
                    token: token
                }

                //initial sessions
                // req.session.email = data[0].email
                // req.session.password = data[0].password
                 req.session.uid = data[0]._id

                res.send(dataRes);
            }else{
                const dataRes = {
                    status: "error",
                    message: constants.error.L1006
                }
                res.send(dataRes);
            }
        }

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
            res.send(dataRes)
            
        }else{
            res.send(dataRes)
        }
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
               console.log(data)
               res.send({message: constants.success.A1001})
            }
        })

    }catch(error){
        throw Error(error)
    }
}

// export const loginWithFacebook = async (req, res) =>{

// }

// export loginWithGoogle = async (req, res) =>{
    
// }