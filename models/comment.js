let mongoose = require('mongoose');

Schema = mongoose.Schema;


// Product schema
let commentSchema = mongoose.Schema({
  comment:{
    type: String,
    required: true
  }
}, {
  timestamps: true
});

let Comment = module.exports = mongoose.model('Comment', commentSchema);