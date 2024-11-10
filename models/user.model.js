const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  secondName: { type: String, required: true, trim: true },
  role:{type:String, required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},{
  versionKey:false
});

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;

