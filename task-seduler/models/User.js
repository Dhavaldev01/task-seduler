const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },   user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Reference to the User model
    }
}, {
    timestamps:true
})


 userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 10);
    next();
 })

 userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
const User = mongoose.model('User', userSchema);
module.exports = User;