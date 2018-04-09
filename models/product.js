let mongoose = require('mongoose');
Schema = mongoose.Schema;

// Product schema
let productSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description:{
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
});

//merchant


let Product = module.exports = mongoose.model('Product', productSchema);