import Visitor from '../../models/rag_zakyat/zakyatVisitors.js';

export const addVisitor = async (req, res) =>{
    const {ip, date} = req.body;

    try {
        const isExist = await Visitor.findOne({ip, date});
        if(isExist){
            return res.json(isExist);
        }else{
            const visitor = new Visitor(req.body);
            await visitor.save();
            return res.json(visitor);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}