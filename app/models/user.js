import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_at: Date,
    update_at: Date
});
userSchema.pre('save', (next) => {
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});

const User = mongoose.model('User', userSchema);