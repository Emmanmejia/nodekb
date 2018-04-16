let mongoose = require('mongoose');

Schema = mongoose.Schema;


// Product schema
let purchaseSchema = mongoose.Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  product_id:{
    type: Schema.Types.ObjectId,
    required: true, 
    ref: 'Product'
  }
}, {
  timestamps: true
});

//status
//price??

let Purchase = module.exports = mongoose.model('Purchase', purchaseSchema);