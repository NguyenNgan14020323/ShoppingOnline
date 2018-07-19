import * as productModel from '../models/product';

export const createProductCtrl = async (req, res) => {
    try {
        const data = await productModel.createProduct(req.body);
        res.json(data);
    } catch (error) {
        throw Error(error);
    }
}

export const getAllProductCtrl = async (req, res) => {
    try {
        const data = await productModel.getAllProduct();
        if (data == "not found") {
            res.status(404).json({
                 status: 404,
                "product": data
            });
        } else {
            res.status(200).json({
                 status: 200,
                "product": data
            })
        }
    } catch (error) {
        throw Error(error);
    }
}

export const getProductCatalogCtrl = async (req, res) => {
    const id = req.params.catalog_id;
    try {
        const data = await productModel.getProductCatalog(id);
        if (data == "not found") {
            res.status(404).json({
                "product": data
            });
        } else {
            res.status(200).json({
                "product": data
            })
        }
    } catch (error) {
        throw Error(error);
    }
}

export const getProductCatalogCtrl1 = async (req, res) => {
    const catalog_id = req.query.catalog_id;
    try {
        const data = await productModel.getProductCatalog(catalog_id);
        if (data == "not found") {
            res.status(404).json({
                "product": data
            });
        } else {
            res.status(200).json({
                "product": data
            })
        }
    } catch (error) {
        throw Error(error);
    }
}

export const getProductDetailCtrl = async (req, res) => {
    const product_id = req.params.product_id;
    try {
        const data = await productModel.getProductDetail(product_id);
        res.status(200).json({
            "productDetail": data
        })
    } catch (error) {
        throw Error(error);
    }
}