let mongoose = require('mongoose');
Schema = mongoose.Schema;

// Product schema
let productSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
  description:{
    type: String,
    required: true
  },
  benefits:{
    type: String,
    required: true
  },
  conditions:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  merchant:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  price:{
    type: Number,
    required: true
  },
  duration:{
    type: Number,
    required: true
  },
  purchases:[{
    type: Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  is_approved:{
    type: Boolean,
    default: false
  },
  is_hidden:{
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

//merchant


let Product = module.exports = mongoose.model('Product', productSchema);