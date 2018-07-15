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
        res.send(data);
    } catch (error) {
        res.send(error);
    }
}