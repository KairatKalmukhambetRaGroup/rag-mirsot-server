import Image from '../models/page/image.js';
import fs from 'fs';
import mongoose from 'mongoose';
import Page from '../models/page/page.js';

export const updateImage = async(req, res) => {
    const {id} = req.params;
    try {
        const imageExist = await Image.findById(id);
        if(!imageExist)
            return res.status(404).json({error: "Image does not exist"});
        const oldFile = imageExist.src;
            
        const newImage = await Image.findByIdAndUpdate(id, {src: req.file.filename}, {new: true});
        fs.stat(`./public/${oldFile}`, function (err, stats) {         
            if (err) 
                return console.error(err);
            fs.unlink(`./public/${oldFile}`,function(err){
                if(err) 
                    return console.log(err);
            });  
        });
        return res.status(200).json(newImage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}
export const updateImages = async(req, res) => {
    const {parentId} = req.params;
    const {indexArr, deleteArr} = JSON.parse(req.body.data);
    try {
        // console.log(req.body.images)

        if(req.files.length !== indexArr.length)
            return res.status(400).json({error: "Something went wrong."});

        const parent = await Page.findById(parentId);
        let parentImages = parent.images;

        for (let i = 0; i < indexArr.length; i++) {
            const index = indexArr[i];
            if(mongoose.Types.ObjectId.isValid(index)){
                const imageExist = await Image.findById(index);
                if(imageExist){
                    const oldFile = imageExist.src;
                    await Image.findByIdAndUpdate(imageExist._id, {src: req.files[i].filename});
                    fs.stat(`./public/${oldFile}`, function (err, stats) {         
                        if (err) 
                            return console.error(err);
                        fs.unlink(`./public/${oldFile}`,function(err){
                            if(err) 
                                return console.log(err);
                        });  
                    });
                }
            }else{
                const newImage = await Image.create({name: req.files[i].filename,src: req.files[i].filename});
                parentImages.push(newImage._id);
            }
        }
        for (let i = 0; i < deleteArr.length; i++) {
            const deleteId = deleteArr[i];
            const imageExist = await Image.findById(deleteId);
            if(imageExist){
                const oldFile = imageExist.src;
                parentImages = parentImages.filter(imgId=> !imageExist._id.equals(imgId));

                await Image.findByIdAndRemove(imageExist._id);

                fs.stat(`./public/${oldFile}`, function (err, stats) {         
                    if (err) 
                        return console.error(err);
                    fs.unlink(`./public/${oldFile}`,function(err){
                        if(err) 
                            return console.log(err);
                    });  
                });
            }
        }
        const newImages = await Page.findByIdAndUpdate(parentId, {images: parentImages}, {new: true}).populate('images');

        return res.status(200).json(newImages.images.slice(1));
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}
