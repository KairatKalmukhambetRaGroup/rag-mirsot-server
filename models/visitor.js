import mongoose from "mongoose";

const visitorSchema = mongoose.Schema({
    ip: String,
    date: String,
    week: String,
    month: String,
}, {
    timestamps: true
});

export default mongoose.model('Visitor', visitorSchema);