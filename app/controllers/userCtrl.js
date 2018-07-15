import * as userModel from '../models/user';
import md5 from 'md5';

export const createUserCtrl = async (req, res) => {
    req.body.password = md5(req.body.password);
    try {
        const data = await userModel.createUser(req.body);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
}

export const checkUserLoginCtrl = async (req, res) => {
    req.body.password = md5(req.body.password);
    try {
        const data = await userModel.checkUserLogin(req);
        const dataRes = {
            id: data[0]._id,
            email: data[0].email,
            name: data[0].name,
            adress: data[0].adress,
        }
        //initial sessions
        req.session.email = data[0].email
        req.session.password = data[0]._id
        console.log(data)
        res.send(dataRes);
    } catch (error) {
        res.send(error);
    }
}