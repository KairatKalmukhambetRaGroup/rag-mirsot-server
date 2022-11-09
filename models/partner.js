import mongoose from "mongoose";

const partnerSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    link: {type: String, required: true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'}, 
    description: {
        ru: String,
        kz: String,
        en: String,
    }
},{
    timestamps: true
});

export default mongoose.model('Partner', partnerSchema);