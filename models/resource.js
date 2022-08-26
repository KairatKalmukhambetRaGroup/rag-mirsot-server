import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

const resourceSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    slug: {type: String, slug: "name"},
    roles: [{
        role_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    }]
}, {
    timestamps: true
});

export default mongoose.model('Resource', resourceSchema);