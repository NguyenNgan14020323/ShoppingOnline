import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    salt:{
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
    avatar: {
        type: String,
        required: false,
        default: ""
    },
    api_type: {//provider like facebook or google
        type: String,
        required: false,
        default: ""
    },
    gender: {
        type: String,
        required: false,
        default: ""
    },
    role: {
        type: String,
        required: false,
        default: "User"
    },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next){  
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});

const User = mongoose.model('User', userSchema);

/**
 * Create a new user
 * @param {object} req
 * @returns {object} user created
 */
export const createUser = (req) => {
    const newUser = new User(req);
  
    return newUser.save((err, user) => {
         if (err) {
             return Error(err); 
        }
        return user;
    });
};

//login in general
export const checkUserLogin = req => User.find({ email: req.body.email})
    .then((user) => {
        if (user.length < 1 || user == "") {
            return false;
        }

        if (req.body.password == user[0].password) {
            return user;
        }     
        return false;
    })
    .catch(err => Error(err));

export const checkUserLoginbyId = req => User.find({ _id: req})
    .then((user) => {
        if (user.length < 1) {
            return false;
        }

        if (req.toString() == user[0]._id) {
            return user;
        }     
        return false;
    })
    .catch(err => Error(err));

//when user login by api
export const checkUserLoginbyEmail = email => User.find({ email: email})
    .then((user) => {
        if (user.length < 1) {
            return false;
        }

        if (email.toString() == user[0].email) {
            return user[0];
        }     
        return false;
    })
    .catch(err => Error(err));

export const checkExistedAcc = req => User.find({ email: req.body.email})
    .then((user) => {
        if (user.length < 1 || user == "") {
            return false;
        }else 
            return true;
    })
    .catch(err => Error(err));


export const updateUser = (id, req) => {
    console.log(req)
     User.findByIdAndUpdate(id, {$set: req}, {new: true}, (err, user) => {
        if (err) 
            return Error(err);
        else {
            return user;
        }
    })
}
