import mongoose from "mongoose";

const staffSchema = mongoose.Schema({
    name: {
        ru: String,
        en: String,
        kz: String,
    },
    position: {
        ru: String,
        en: String,
        kz: String,
    },
    text: {
        ru: String,
        en: String,
        kz: String,
    },
    email: String,
    image: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Image'
    }
},{
    timestamps: true
});

export default mongoose.model('Staff', staffSchema);