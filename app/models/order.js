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
    qty: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    data: { type: String },
    status: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);