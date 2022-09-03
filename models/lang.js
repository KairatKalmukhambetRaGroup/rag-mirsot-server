import mongoose from "mongoose";

const langSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    title: {type: String, required: true, unique: true},
    isOn: {type: Boolean, default: true},
}, {
    timestamps: true
});

export default mongoose.model('Language', langSchema);