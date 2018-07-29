import * as productModel from '../models/product';
import CryptoJS from 'crypto-js';
import constants from '../../config/constants';


const KEY_HASH_COOKIE = constants.key_cookie_pview


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
        //check isexist cookies
        var cookiestore = req.cookies.pviews, temp = [], i = 0, flag = true
        if(cookiestore !== undefined){
             var bytes = CryptoJS.RC4.decrypt(cookiestore, KEY_HASH_COOKIE);
             temp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

             for(i; i < temp.length; i++){
                  if(temp[i].id == product_id){
                    flag = false
                     break
                  }
             }
        }else
           flag = true
        
        if(flag){
           temp[temp.length] = {id: product_id}
           const dataProduct = await productModel.getProductDetail(product_id);
           const updateView = await productModel.updateView(product_id, dataProduct[0].view + 0.5);//angular request 2 time
        }

        res.cookie('pviews', CryptoJS.RC4.encrypt(JSON.stringify(temp), KEY_HASH_COOKIE).toString(), {httpOnly: true });

        const data = await productModel.getProductDetail(product_id);
        res.status(200).json({
            "productDetail": data
        })

    } catch (error) {
        throw Error(error);
    }
}

export const getCart = async (req, res) => {

    
    let Cookie = req.headers.cookie.split("; "),
        listId, i = 0 
    for(; i < Cookie.length; i++){
        if(Cookie[i].search(/^pd_ws=/) != -1){
            listId = Cookie[i].split('pd_ws=')[1];
            break;
        }
    }
    
    try {
        let Ids = JSON.parse(JSON.parse(decodeURIComponent(listId))),
            listProduct = [], i;
         for (i = 0; i < Ids.length; i++){
            const data = await productModel.getProductDetail(Ids[i].id);
            listProduct[i] = data[0];
         }
      
        res.status(200).json({
            status: 200,
            "listProduct": listProduct
        })
    } catch (error) {
        throw Error(error);
    }
}

export const getCustomViewPd = async (req, res) => {
    
    try {
        let Ids = JSON.parse(JSON.parse(req.cookies.cview)),
            listProduct = [], i;
         for (i = 0; i < Ids.length; i++){
            const data = await productModel.getProductDetail(Ids[i].id);
            listProduct[i] = {}
            listProduct[i].data = data[0];
            listProduct[i].infor = {
                 viewed : Ids[i].viewed,
                 time   : Ids[i].time
            }
         }
            
        res.status(200).json({
            status: 200,
            "listProduct": listProduct
        })
    } catch (error) {
        throw Error(error);
    }
}


export const buyProduct = async (req, res, next) => {

    try {

        const data = {};
        
        res.status(200).json({
            status: 200,
            "product": data
        })
    } catch (error) {
        throw Error(error);
    }
}
