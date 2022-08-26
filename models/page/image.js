import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    src: String,
    name: String
}, {
    timestamps: true
});

export default mongoose.model('Image', imageSchema);