import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const productSchema = new Schema({
    catalog_id: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
    },
    name: String,
    price: Number,
    content: String,
    discount: Number, //lưu chiết khấu, giảm giá    
    image_link: String,
    image_list: String,
    view: Number,
    created_at: Date,
    updated_at: Date
});
productSchema.pre('save', function(next){
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});

const Product = mongoose.model('Product', productSchema);

export const createProduct = req => {
    const newProduct = new Product(req);
    return newProduct.save((err, product) => {
        if (err) return Error(err);

        return product;
    })
}

export const getAllProduct = () => Product.find()
    .sort({"view":-1, "created_at": -1})//giảm dần
    .then((products) => {
        if (products < 0) {
            return "not found"
        }
        return products;
    })
    .catch(err => Error(err));

export const getProductCatalog = (catalog_id) => Product.find({catalog_id: catalog_id})
    .sort({"view":-1, "created_at": -1})//giảm dần
    .then((products) => {
        if (products.length < 0) {
            return "not found"
        }
        return products;
    })
    .catch(err => Error(err));

export const getProductDetail = (id) => Product.find({_id: id}, (err, product) => {
    if (err) return Error(err);

    return product;
})