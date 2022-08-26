import mongoose from "mongoose";

const pageSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    title: {
        kz: String,
        ru: String,
        en: String
    },
    description: {
        kz: String,
        ru: String,
        en: String
    },
    images: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Image'}
    ],
    subpages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Page'
    }],
    parent: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Page'
    },
    showOnHeader: {type: Boolean, default: true}
}, {
    timestamps: true
});

export default mongoose.model('Page', pageSchema);
