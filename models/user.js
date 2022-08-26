import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {type: String, unique: true, lowercase: true , required: true},
    username: {type: String, required: true},
    password: String,
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true}
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);