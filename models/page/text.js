import mongoose from "mongoose";

const textSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    all: String,
    ru: String,
    en: String,
    kz: String,
}, {
    timestamps: true
});

export default mongoose.model('Text', textSchema);