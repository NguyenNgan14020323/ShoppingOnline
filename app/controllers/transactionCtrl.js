import * as transactionCtrl from '../models/transaction';
import constants from '../../config/constants';

export const createTransactionCtrl = (req, res) => {

    var dataRes = {
      error: true,
      message: constants.error.L1009
    }
 		
 	 console.log(req.body)
    var Transaction = {
    	status: req.body.PaymentMethod.type, 
    	user_id: req.authenticate.id,
    	user_name: req.body.User.name,
    	user_address: req.body.User.address,
    	user_phone: req.body.User.phone,
    	message: req.body.User.message,
    }

    console.log(Transaction)

    res.json(dataRes)
}