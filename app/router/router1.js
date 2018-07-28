import express from 'express';
import * as catalogCtrl from'../controllers/catalogCtrl';
import * as productCtrl from '../controllers/productCtrl';
import verifyToken from '../../config/verifyToken';
import constants from '../../config/constants';

const Router = express.Router();

Router.use(function(req, res, next)
{

	var Cookie = req.headers.cookie.split("; "),
        _csrf_token, i = 0, client_csrf

    // for(; i < Cookie.length; i++){
    //     if(Cookie[i].search(/^XSRF_TOKEN=/) != -1){
    //         _csrf_token = Cookie[i].split('XSRF_TOKEN=')[1];
    //         break;
    //     }
    // }

     //way 2: reading cookie in req.cookies
    _csrf_token = req.cookies.XSRF_TOKEN

    if(req.method == "GET"){//not check with get
		client_csrf = _csrf_token
    }else
    	client_csrf = req.body._csrftoken

      console.log(client_csrf + "   " + _csrf_token)
	if(_csrf_token === client_csrf)
		next()
	else{
	    return res.status(404).send({
		   success: false, 
		   message: constants.error.L1007 
		});
    }
		
})

//Catalog
Router.post('/createCatalog', catalogCtrl.createCatalogCtrl);
Router.get('/getAllCatalog', catalogCtrl.getAllCatalogCtrl);

//Product
Router.post('/createProduct', productCtrl.createProductCtrl);
Router.get('/getAllProduct', productCtrl.getAllProductCtrl);
Router.get('/productCatalog/:catalog_id', productCtrl.getProductCatalogCtrl);//get by parameters
Router.get('/productCatalog', productCtrl.getProductCatalogCtrl1);//get by query string
Router.get('/getproductDetail/:product_id', productCtrl.getProductDetailCtrl);

//Cart
Router.get('/cartProduct', productCtrl.getCart);

//Product view
Router.get('/cviewproduct', productCtrl.getCustomViewPd);

//buy product
Router.post('/buyProduct', verifyToken, productCtrl.buyProduct);

export default Router;