import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const catalogSchema = new Schema({
    name: String,
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
    }, //id of parent catelog,because catalog has many level
    sort_order: Number //vị trí sắp xếp(hiển thị)
});

const Catalog = mongoose.model('Catalog', catalogSchema);

export const createCatalog = (req) => {
    const newCatalog = new Catalog(req);
    return newCatalog.save((err, catalog) => {
        if (err) return Error(err);

        return catalog;
    })
};

export const getAllCatalog = () => Catalog.find({}, (err, listCatalog) => {
    if (err) return Error(err);

    return listCatalog;
})