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
  birthdate:{
    type: Date
  },
  username:{
    type: String,
    required: true,
    unique: true
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
}, {
  timestamps: true
});

const User = module.exports = mongoose.model('User', userSchema);