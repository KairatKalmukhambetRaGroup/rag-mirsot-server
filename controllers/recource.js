import Resource from "../models/resource.js";

export const createRecource = async (req, res) => {
    const {name} = req.body;
    
    try {
        const existingResource = await Resource.findOne({name});
        if(existingResource) 
            return res.status(409).json({error: "Resource already exist."});
        
        const role = new Resource(req.body);
        await role.save();  

        const roles = await Resource.find().populate('roles');
        return res.status(200).json(roles);      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getResources = async (req, res) => {
    try {
        const roles = await Resource.find().populate('roles.role_id');
        return res.status(200).json(roles);      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

