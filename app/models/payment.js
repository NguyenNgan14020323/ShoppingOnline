import mongoose from 'mongoose';

const {Schema} = mongoose;
mongoose.Promise = global.Promise;

const paymentSchema = new Schema({
	numberCard: String,
	nameCard: String,
	expires: Date,
	CVV: Number,
	money: Number,
});

const Payment = mongoose.model('Payment', paymentSchema);

export const createPayment = (req) => {
	const newPayment = new Payment(req);
	 return newPayment.save((err, payment) => {
        if (err) return Error(err);

        return payment;
    })
}

export const getPayment = (numberCard) => Payment.find({"numberCard": numberCard})
    .then((payment) => {
        return payment;
    })
    .catch(err => Error(err));

export const updatePayment = (numberCard, money) => {
	Payment.update({"numberCard": numberCard}, {money: money}, (err, payment) => {
        if (err) return Error(err);
        return payment;
    })
}