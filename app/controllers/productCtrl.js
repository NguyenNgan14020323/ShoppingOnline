import * as productModel from '../models/product';

export const createProductCtrl = async (req, res) => {
    try {
        const data = await productModel.createProduct(req.body);
        res.json(data);
    } catch (error) {
        throw Error(error);
    }
}