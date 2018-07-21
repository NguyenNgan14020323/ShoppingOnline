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
    amount: Number,
    data: String,
    status: Number
});

const Order = mongoose.model('Order', orderSchema);