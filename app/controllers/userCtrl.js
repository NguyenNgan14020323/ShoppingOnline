import * as userModel from '../models/user';
import md5 from 'md5';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';


const KEY_HASH = "linhvancute"
const MYHOST = "localhost:3000"
const TOKEN_TIME = 3*3600*24

export const createUserCtrl = async (req, res) => {

    req.body.password = CryptoJS.SHA256(req.body.password).toString();
    try {
       
        const data = await userModel.createUser(req.body);
        console.log(data)
         var hash = {
            id: data._id,
            name: data.name,
            email:  data.email,
            addres: data.address,
            phone: data.phone
        }
             
        var token = jwt.sign( hash, data._id.toString(), {algorithm: 'HS256', expiresIn: TOKEN_TIME});

        const dataRes = {
            id: CryptoJS.AES.encrypt(data._id.toString(), KEY_HASH).toString(),
            name: data.name,
            token: token
        }

         //initial sessions
        // req.session.email = data.email
        // req.session.password = data.password
        // req.session.uid = data._id
        res.send(dataRes);
        
    } catch (error) {
        throw Error(error);
    }
}

export const checkUserLoginCtrl = async (req, res) => {

    try {

        var data;
        if(req.headers.host == MYHOST){//except all requests from my host

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
                
                var token = jwt.sign(hash, data[0]._id.toString(), {algorithm: 'HS256', expiresIn: TOKEN_TIME});

                const dataRes = {
                    id: CryptoJS.AES.encrypt(data[0]._id.toString(), KEY_HASH).toString(),
                    name: data[0].name,
                    token: token
                }

                //initial sessions
                // req.session.email = data[0].email
                // req.session.password = data[0].password
                // req.session.uid = data[0]._id

                res.send(dataRes);
            }else{
                const dataRes = {
                    status: "error",
                    message: "Login faild"
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
    console.log(req.headers)
    try {
        //destroy sessions
        req.session.destroy()
        res.send({logout:true});
    } catch (error) {
        throw Error(error);
    }
}