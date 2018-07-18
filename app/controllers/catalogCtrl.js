import * as catalogModel from '../models/catalog';

export const createCatalogCtrl = async (req, res) => {
    try {
        const data = await catalogModel.createCatalog(req.body);
        res.json(data);
    } catch (error) {
        throw Error(error);
    }
}

export const getAllCatalogCtrl = async (req, res) => {
    try {

        const data = await catalogModel.getAllCatalog();
        var catalogs = [];
        let j = 0;
        for (let i = 0; i < data.length; i++){
            if (data[i].parent_id === undefined){
                catalogs[j] = {}
                catalogs[j].parentCatalog = data[i];
                let k = 0;
                let temp = [];

                for (let t = 0; t < data.length; t++){
                    if (data[t].parent_id !== undefined && data[t].parent_id.toString() === data[i]._id.toString()){ 
                        temp[k++] = data[t];
                    }
                }
                catalogs[j].childCatalog = temp;
                j++;
            }
        }
        res.send(catalogs);
    } catch (error) {
        throw Error(error);
    }
}
