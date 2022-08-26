import Role from "../models/role.js";

export const createRole = async (req, res) => {
    const {name} = req.body;
    
    try {
        const existingRole = await Role.findOne({name});
        if(existingRole) 
            return res.status(409).json({error: "Role already exist."});
        
        const role = new Role({name});
        await role.save();  

        const roles = await Role.find();
        return res.status(200).json(roles);      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res.status(200).json(roles);      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

