import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Resource from '../models/resource.js';

export const auth = async (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(404).json({message: "Token not found"});
    }
    // if(!req.headers.resource_id){
    //     return res.status(404).json({message: "Resource ID not found"});
    // }
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodedData = jwt.verify(token, process.env.TOKEN_KEY);
        req.userId = decodedData.id;
        const user = await User.findById(req.userId).populate('role');
        req.userRole = user.role.name;
        var allow = true;
        // const perms = await getPerms(user.role, req.headers.resource_id);
        // if (req.method == "POST" && perms.create) allow = true;
        // else if (req.method == "GET" && perms.read) allow = true;
        // else if (req.method == "PUT" && perms.update) allow = true;
        // else if (req.method == "DELETE" && perms.delete) allow = true;

        if(allow)   next();
        else
            return res.status(403).json({error: 'Access denied'});
    } catch (error) {
        switch(error.name){
            case 'JsonWebTokenError':
                return res.status(400).json({message: "Invalid token"});
            default:
                console.log(error);
                return res.status(500).json({message: "Something went wrong"});
        }
    }
}

const getPerms = async (role_id, resource_id) => {
    var perms = {create: false, read: false, update: false, delete: false};
    try {
        const resource = await Resource.findById(resource_id);

        for (let index = 0; index < resource.roles.length; index++) {
            const role = resource.roles[index];
            if(String(role.role_id) === String(role_id)){
                perms.create = role.create;
                perms.read = role.read;
                perms.update = role.update;
                perms.delete = role.delete;
            }
        }
    } catch (error) {
        throw error;
    }
    return perms;
}

export const permit = (...permitedRoles)=>{
    return  (req, res, next) => {
        const {userRole} = req;

        if(userRole && (userRole === 'superadmin' || permitedRoles.includes(userRole))){
            next();
        }else{
            res.status(403).json({error: "Forbidden"});
        }
    }
}