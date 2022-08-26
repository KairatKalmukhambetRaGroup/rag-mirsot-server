import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
    title:{
        ru: String,
        en: String,
        kz: String,
    },
    subtitle:{
        ru: String,
        en: String,
        kz: String,
    },
}, {
    timestamps: true
});

export default mongoose.model('Card', cardSchema);