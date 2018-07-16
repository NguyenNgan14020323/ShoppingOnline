import * as catalogModel from '../models/catalog';

export const createCatalogCtrl = async (req, res) => {
    try {
        const data = await catalogModel.createCatalog(req.body);
        res.send(data);
    } catch (error) {
        throw Error(error);
    }
}