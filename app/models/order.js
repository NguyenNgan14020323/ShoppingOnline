import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const orderSchema = new Schema({
    transaction_id: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    qty: Number,
    status: Number,
    created_at: Date,
    updated_at: Date,
});

orderSchema.pre('save', function(next){
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});

const Order = mongoose.model('Order', orderSchema);

export const createOrder = (req) => {
    const newOrder = new Order(req);
    return newOrder.save((err, order) => {
        if (err) return Error(err);

        return order;
    })
}

export const getOrder = (transaction_id) => Order.find({"transaction_id": transaction_id})
    .sort({updated_at: -1})
    .then((order) => {
        return order;
    })
    .catch(err => Error(err));


export const deleteOrder = (order_id, callback) => {
     Order.findByIdAndUpdate(order_id, {status: 3, updated_at: Date.now()}, {new: true}, (err, order) => {
        if (err) 
            callback(err, null)
        else {
            return   callback(null, true);
        }
    })
}
