import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    password: String,
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

export const checkUserLogin = req => User.find({ email: req.body.email})
    .then((user) => {
        if (user.length < 1) {
            return false;
        }
        if (req.body.password === user[0].password) {
            return user;
        }     
        return false;
    })
    .catch(err => Error(err));