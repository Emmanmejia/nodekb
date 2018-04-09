const mongoose = require('mongoose');
Schema = mongoose.Schema;

// User Schema
const userSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  purchases:[{
    type: Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  is_merchant:{
    type: Boolean,
    default: false
  },
  is_admin:{
    type: Boolean,
    default: false
  },
  is_hidden:{ // temporary delete
    type: Boolean,
    default: false
  }
});

const User = module.exports = mongoose.model('User', userSchema);
