import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const transactionSchema = new Schema({
    status: {
        type: Number,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    user_name: { type: String },
    user_email: { type: String },
    user_phone: { type: String },
    amount: {
        type: Number,
        required: true
    },
    payment: { type: String },
    payment_info: { type: String },
    message: { type: String },
    security: { type: String },
    create_at: Date,
    updated_at: Date
});

userSchema.pre('save', (next) => {
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});