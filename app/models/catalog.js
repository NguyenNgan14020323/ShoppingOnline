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

export const createCatalog = (req) => {
    const newCatalog = new Catalog(req);
    return newCatalog.save((err, catalog) => {
        if (err) return Error(err);

        return catalog;
    })
};