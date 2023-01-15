import ConversionButton from "../../models/rag_zakyat/conversionButton.js";
import Visitor from '../../models/rag_zakyat/zakyatVisitors.js';

export const addButton = async(req, res) => {
    const {name} = req.body;
    try {
        const isExist = await ConversionButton.findOne({name});
        if(isExist){
            return res.status(404).json();
        }else{
            const button = new ConversionButton(req.body);
            await button.save();
            return res.json(button);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getButtons = async (req,res) => {
    try {
        const buttons = await ConversionButton.find();
        return res.json(buttons);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const updateRate = async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try {
        const button = await ConversionButton.findOne({name});
        await Visitor.findByIdAndUpdate(id, {$addToSet: {buttons: button.id}});
        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getConversionRate = async (req, res) => {
    const {start, end} = req.query;
    if(!start || !end){
        return res.status(400).json({error: "Missing or invalid required parameter"});
    }
    const startDate = new Date(start);
    const endDate = new Date(new Date(new Date(end).setUTCHours(0,0,0,0)).valueOf() + 1000*60*60*24);
    // VALIDATE DATE
    if(!(startDate instanceof Date && !isNaN(startDate)) || !(endDate instanceof Date && !isNaN(endDate)) ||  startDate >= endDate){
        return res.status(400).json({error: "Missing or invalid required parameter"});
    }
    try {
        var conversion = {total: 0};
        const buttons = await ConversionButton.find();
        for (const btn of buttons){
            conversion[btn.name] = 0;
        }

        for await (const visitor of Visitor.find({createdAt: {$gte: startDate, $lt: endDate}}).populate('buttons')){
            conversion.total ++;
            visitor.buttons.map((btn)=>{
                conversion[btn.name]++;
            });
        }

        return res.json({buttons, conversion});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}