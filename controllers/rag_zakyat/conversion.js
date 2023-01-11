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
    try {
        var conversion = {total: 0};
        const buttons = await ConversionButton.find();
        for (const btn of buttons){
            conversion[btn.name] = 0;
        }

        for await (const visitor of Visitor.find().populate('buttons')){
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