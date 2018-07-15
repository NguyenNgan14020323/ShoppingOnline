import mongoose from 'mongoose';

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const productSchema = new Schema({
    catalog_id: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    image_link: {
        type: String,
        required: true,
    },
    image_list: {
        type: String,
        required: true,
    },
    view: {
        type: Number,
        required: true,
    },
    create_at: Date,
    update_at: Date
});
productSchema.pre('save', (next) => {
    const cur = new Date().toISOString();
    this.updated_at = cur;
    if (!this.created_at) {
      this.created_at = cur;
      next();
    }
});

const Product = mongoose.model('Product', productSchema);

