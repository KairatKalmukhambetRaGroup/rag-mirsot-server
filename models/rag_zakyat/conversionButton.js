import mongoose from "mongoose";

const conversionButtonSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    block: {
        kz: String,
        ru: String,
        en: String
    },
    button: {
        kz: String,
        ru: String,
        en: String
    }
}, {
    timestamps: true
});

export default mongoose.model('ConversionButton', conversionButtonSchema);