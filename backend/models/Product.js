const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Gold', 'Silver', 'Diamond', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal Sets', 'Pendants', 'Chains', 'Bracelets', 'Anklets'],
  },
  price: {
    type: Number,
    min: 0
  },
  priceVisible: {
    type: Boolean,
    default: true
  },
  weight: {
    type: String,
    trim: true
  },
  purity: {
    type: String,
    trim: true,
    // e.g., "22K", "18K", "925 Sterling"
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String
    }
  }],
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, featured: 1, trending: 1 });

module.exports = mongoose.model('Product', ProductSchema);
