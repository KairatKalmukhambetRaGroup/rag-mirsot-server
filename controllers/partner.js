import Partner from '../models/partner.js';
import Image from '../models/page/image.js';

export const createPartner = async (req, res) => {
    try {
        let image = null;
        if(req.file){
            const newImg = await Image.create({src: req.file.filename, name: req.file.filename});
            image = newImg._id;
        }
        
        const newPartner = await Partner.create({...req.body, image: image});
        return res.json(newPartner);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong"});
    }
}

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().populate('image');
        return res.json(partners);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong"});
    }
}

export const updatePartner = async (req, res) => {
    const data = JSON.parse(req.body.data);
    const {id} = req.params;
    try {
        const existingPartner = await Partner.findById(id);
        if(!existingPartner)
            return res.status(404).json({error: "Partner not found"});
        let image = data.image;
        if(req.file){
            const newImg = await Image.create({src: req.file.filename, name: req.file.filename});
            image = newImg._id;
        }
        const updatedPartner = await Partner.findByIdAndUpdate(id, {...data, image: image}, {new:true});

        return res.json(updatedPartner);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong"});
    }
}