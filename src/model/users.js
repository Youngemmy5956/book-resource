import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: {type: Number, required: true},
    password:{ type: String, minLength: 8, required: true },
    confirmPassword:{ type: String, minLength: 8, required: true },

});


const User_model = mongoose.model("Users", userSchema);

export default User_model;