import * as userModel from '../models/user';
import md5 from 'md5';

export const createUserCtrl = async (req, res) => {
    req.body.password = md5(req.body.password);
    try {
        const data = await userModel.createUser(req.body);
        const dataRes = {
            id: data._id,
            name: data.name
        }
        //initial sessions
        req.session.email = data.email
        req.session.password = data.password
        req.session.uid = data._id
        res.send(dataRes);
    } catch (error) {
        throw Error(error);
    }
}

export const checkUserLoginCtrl = async (req, res) => {
    try {
        var data;
        if (req.body.password != undefined){
            req.body.password = md5(req.body.password);
            data = await userModel.checkUserLogin(req);
        } else {
            data = await userModel.checkUserLoginbyId(req);
        }
        if (typeof(data) !== 'boolean'){
            const dataRes = {
                id: data[0]._id,
                name: data[0].name
            };
            //initial sessions
            req.session.email = data[0].email
            req.session.password = data[0].password
            req.session.uid = data[0]._id
            res.send(dataRes);
        } else {
            const dataRes = {
                status: "error",
                message: "Login faild"
            };
            res.send(dataRes);
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
        res.send({logout:true});
    } catch (error) {
        throw Error(error);
    }
}