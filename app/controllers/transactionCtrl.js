import * as transactionModel from '../models/transaction';
import * as productModel from '../models/product';
import * as paymentModel from '../models/payment';
import * as orderModel from '../models/order';
import constants from '../../config/constants';

import md5 from 'md5';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const KEY_HASH = constants.key_hash_pass
const MYHOST = constants.host
const TOKEN_TIME =constants.token_live_time
const PRIVATE_KEY_TOKEN = constants.key_decode_token


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

        //Chọn phương thức thanh toán là Thẻ tín dụng/ Thẻ ghi nợ
        if(req.body.PaymentMethod.type == 1){
            const infoCard = await paymentModel.getPayment(req.body.PaymentMethod.infor.numbercard);
            if (infoCard[0].CVV != req.body.PaymentMethod.infor.cvv) {
                res.json({
                    error: true,
                    message: constants.error.L1001
                })
            } else {
                if (infoCard[0].money >= (ProductInfo.total.price + ProductInfo.total.feeShip)) { 
                    var getDate = req.body.PaymentMethod.infor.expires.split('/')
                    creditInfo = {
                        numberCard: req.body.PaymentMethod.infor.numbercard,
                        nameCard: req.body.PaymentMethod.infor.name,
                        expires: getDate[2] +"-"+getDate[1]+"-"+getDate[0],
                        CVV: req.body.PaymentMethod.infor.cvv,
                        money: infoCard[0].money - (ProductInfo.total.price + ProductInfo.total.feeShip)
                    }
                    var Transaction = {
                        status: req.body.PaymentMethod.type, 
                        user_id: req.authenticate.id,
                        user_name: req.body.User.name,
                        user_address: req.body.User.address,
                        user_phone: req.body.User.phone,
                        message: req.body.User.message,
                        amount: ProductInfo.total.price + ProductInfo.total.feeShip,
                        payment: 1,
                        payment_info: "Giao dịch thành công"
                    }
                    const pays = await paymentModel.updatePayment(creditInfo.numberCard, creditInfo.money);
                    const trans = await transactionModel.createTransaction(Transaction); 
                     for (let j = 0; j < ProductInfo.products.length; j++) {
                        let temp = {
                            transaction_id: trans.id,
                            product_id: ProductInfo.products[j].id,
                            qty: ProductInfo.products[j].amount,
                            status: 0
                        }
                        const temp1 = await orderModel.createOrder(temp);
                    } 
                    res.status(200).json({
                        status: 'success',
                        message: Transaction.payment_info
                    });
                } else {
                    res.json({
                        error: true,
                        message: constants.error.L1010
                    });
                }      
            }
          
        } else {
            var Transaction = {
                    status: req.body.PaymentMethod.type, 
                    user_id: req.authenticate.id,
                    user_name: req.body.User.name,
                    user_address: req.body.User.address,
                    user_phone: req.body.User.phone,
                    message: req.body.User.message,
                    amount: ProductInfo.total.price + ProductInfo.total.feeShip,
                    payment: 0,
                    payment_info: "Giao dịch thành công"
            }
            const trans = await transactionModel.createTransaction(Transaction);
            for (let j = 0; j < ProductInfo.products.length; j++) {
                let temp = {
                    transaction_id: trans.id,
                    product_id: ProductInfo.products[j].id,
                    qty: ProductInfo.products[j].amount,
                    status: 0
                }
                const temp1 = await orderModel.createOrder(temp);
              
            } 
            res.status(200).json({
                status: 'success',
                message: Transaction.payment_info
            });
        }
    } catch (error) {
        throw Error(error);
    }
}

export const getTransactionCtrl = async (req, res) => {
    
    try {

        if(req.cookies.id !== undefined){
            var bytes  = CryptoJS.AES.decrypt(req.cookies.id, KEY_HASH),
                deid = bytes.toString(CryptoJS.enc.Utf8),
                dataOrder = [], index = 0

            const dataTrans = await transactionModel.getTransaction(deid);
           
            for(let i = 0; i < dataTrans.length; i++){

               let temp = await orderModel.getOrder(dataTrans[i]._id);
               if(temp.length > 0){
                  dataOrder[index] = {
                     orderInfo: {
                        amount: dataTrans[i].amount,
                        payment: dataTrans[i].payment,
                        status: dataTrans[i].status,
                        message: dataTrans[i].message,
                        updated_at: dataTrans[i].updated_at,
                        payment_info: dataTrans[i].payment_info
                     }
                  }

                  dataOrder[index].products = []

                  for(let j = 0; j < temp.length; j++){
                     let product = await productModel.findProductById(temp[j].product_id)
                     dataOrder[index].products[j] = {
                        qty: temp[j].qty,
                        status: temp[j].status,
                        transaction_id: temp[j].transaction_id,
                        name: product[0].name, 
                        image_cover: product[0].image_link,
                        price: product[0].price,
                        discount: product[0].discount 
                     }
                  }

                  index++;
               }
            }
   
            res.status(200).json({
                data: dataOrder
            })
        }else{
             res.status(200).json({
                data: {
                    error: "Not found."
                }
            })
        }

    } catch (error) {
        throw Error(error);
    }
}