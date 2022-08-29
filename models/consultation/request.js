import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    direction: {ru: String, kz: String, en: String},
    service: {ru: String, kz: String, en: String},
    lang: {type: String, required: true}, 
    status: {type: String, default: 'new'},
    date: String,
    week: String,
    month: String,
    year: String,
}, {
    timestamps: true
});

export default mongoose.model('ConsultationRequest', requestSchema);