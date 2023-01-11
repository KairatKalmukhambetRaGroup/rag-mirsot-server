import mongoose from "mongoose";

const zakyatVisitorsSchema = mongoose.Schema({
    ip: String,
    date: String, 
    week: String, 
    month: String,

    buttons: [{type: mongoose.Schema.Types.ObjectId, ref: 'ConversionButton'}],
},{
    timestamps: true
});

export default mongoose.model('ZakyatVisitors', zakyatVisitorsSchema);