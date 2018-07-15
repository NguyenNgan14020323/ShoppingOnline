import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const catalogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
    },
    sort_order: {
        type: Number
    }
});

const Catalog = mongoose.model('Catalog', catalogSchema);