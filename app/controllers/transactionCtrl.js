import * as transactionCtrl from '../models/transaction';
import * as productModel from '../models/product';
import constants from '../../config/constants';


const PERCENT = 0.005

export const createTransactionCtrl = async(req, res) => {

    //data response
    var dataRes = {
      error: true,
      message: constants.error.L1009
    }, i = 0, totalAmount = 0, creditInfo, totalPriceProduct = 0, feeShip = 0, ProductInfo = {}, sale

    try {
        ProductInfo.products = []
        //tinh toan tong so luong hang hoa, tổng giá cả, giá ship và giá các mặt hàng tại thời điểm bán
        for(; i < req.body.Products.length; i++)
        {
            sale = 1
            totalAmount += req.body.Products[i].amount
            const data = await productModel.getProductDetail(req.body.Products[i].id)

            if(data[0].discount != 0)
                sale = 1 - data[0].discount/100
    
            totalPriceProduct += data[0].price * req.body.Products[i].amount * sale;

            ProductInfo.products[i] = {
                id: req.body.Products[i].id,
                amount: req.body.Products[i].amount,
                sale: data[0].discount/100
            }
        }

        feeShip = totalPriceProduct*PERCENT
        ProductInfo.total = {
            price: parseInt(totalPriceProduct),
            feeShip:  parseInt(feeShip)
        }

        console.log(ProductInfo)
     	  
        //Chọn phương thức thanh toán là Thẻ tín dụng/ Thẻ ghi nợ
        if(req.body.PaymentMethod.type == 1){
            var getDate = req.body.PaymentMethod.infor.expires.split('/')
            creditInfo = {
                user_id: req.authenticate.id,//id of customer
                card_num:req.body.PaymentMethod.infor.numbercard,
                name_card: req.body.PaymentMethod.infor.name,
                expires: getDate[2] +"-"+getDate[1]+"-"+getDate[0],
                cvv: req.body.PaymentMethod.infor.cvv
            }
        }

        console.log(creditInfo)
     	console.log(req.body)

        var Transaction = {
        	status: req.body.PaymentMethod.type, 
        	user_id: req.authenticate.id,
        	user_name: req.body.User.name,
        	user_address: req.body.User.address,
        	user_phone: req.body.User.phone,
        	message: req.body.User.message,
        }

        //  console.log(Transaction)
    } catch (error) {
        throw Error(error);
    }

    res.json(dataRes)
}