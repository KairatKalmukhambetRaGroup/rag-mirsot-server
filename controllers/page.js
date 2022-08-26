import Page from "../models/page/page.js";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from "url";
import Text from '../models/page/text.js';
import Image from '../models/page/image.js';
import Card from '../models/page/card.js';
import Staff from '../models/page/staff.js';

export const createPage = async (req, res) => {
    try {
        const newPage = await Page.create(req.body);
        return res.json(newPage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const createSubPage = async (req, res) => {
    const { name } = req.params;
    
    try {
        const page = await Page.findOne({name: name});
        if(!page)
            return res.status(404).json({error: "Page not found!"});

        const subpage = await Page.create({...req.body, parent: page._id});
        page.subpages.push(subpage._id);
        await Page.findByIdAndUpdate(page._id, {subpages: page.subpages});
        return res.json(subpage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}


export const getPages = async (req, res) => {
    try {
        const pages = await Page.find({parent: null}).select('name title showOnHeader').populate({
            path: 'subpages',
            select: 'name title images'
        });
        return res.json(pages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}
export const getPagesByParent = async (req, res) => {
    const {name} = req.params;
    try {
        const parent = await Page.findOne({name});
        const pages = await Page.find({parent: parent._id}).populate('images');

        return res.json(pages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}
export const updatePage = async (req, res) => {
    const { name } = req.params;

    try {
        const page = await Page.findOne({name: name});
        if(!page)
            return res.status(404).json({error: "Page not found!"});
    
        const updatedPage = await Page.findByIdAndUpdate(page._id, req.body);
    
        return res.json(updatedPage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}

export const getPageByName = async (req, res) => {
    const {name} = req.params;
    try {
        const page = await Page.findOne({name: name}).populate('images');
        const texts = await Text.find({parentId: page._id});
        const staff = await Staff.find().populate('image');
        let arr = {};
        arr._id = page._id;
        arr.staff = staff;
        arr.title = page.title;
        arr.description = page.description;
        texts.map((txt) => {
            arr[txt.name] = txt;
        })
        arr.images = page.images;

        if(name === 'home') {
            // directions
            arr.directions = [];
            const direction = await Page.findOne({name: 'directions'}).select('subpages').populate({
                path: 'subpages',
                select: 'title name',
                populate: {
                    path: 'images'
                }
            });
            for (let index = 0; index < direction.subpages.length; index++) {
                const sub = direction.subpages[index];
                arr.directions.push({_id: sub._id, name: sub.name, title: sub.title, image: sub.images[0].src});
            }
            // services
            arr.services = [];
            const service = await Page.findOne({name: 'services'}).select('subpages').populate({
                path: 'subpages',
                select: 'title name',
                populate: {
                    path: 'images'
                }
            });
            for (let index = 0; index < service.subpages.length; index++) {
                const sub = service.subpages[index];
                arr.services.push({_id: sub._id, name: sub.name, title: sub.title, image: sub.images[0].src});
            }
        }
        if(name === 'about'){
            arr.cards = await Card.find();
        }

        if(page.parent){
            arr.siblings = [];
            const parent = await Page.findById(page.parent).select('subpages').populate({
                path: 'subpages',
                select: 'title name',
                match: {
                    _id: {
                        $ne: page._id
                    }
                },
                populate: {
                    path: 'images'
                }
            });
            for (let index = 0; index < parent.subpages.length; index++) {
                const sub = parent.subpages[index];
                arr.siblings.push({_id: sub._id, name: sub.name, title: sub.title, image: sub.images[0].src});
            }
        }

        return res.json(arr);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const createText = async (req, res) => {
    const { name } = req.body;
    try {
        const exist = await Text.findOne({name: name});
        if(exist)
            return res.status(409).json({error: `Content with name "${name}" already exist.`});

        const text = await Text.create(req.body);
        return res.json(text);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const updateText = async (req, res) => {
    const {_id} = req.body;
    try {
        const newText = await Text.findByIdAndUpdate(_id, req.body);
        return res.status(201).json(newText);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}

export const getTextByNames = async (req, res) => {
    const {names} = req.query;
    try {
        const texts = await Text.find({name: {$in: names.split(',')}});
        let arr = {};
        texts.map((txt) => {
            arr[txt.name] = txt;
        })
        return res.json(arr);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const createImage = async (req, res) => {
    const { parentId } = req.body;
    try {

        const image = await Image.create({src: req.file.filename});
        return res.json(image);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const createCard = async (req, res) => {
    try {
        const card = await Card.create(req.body);
        return res.json(card);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}
export const updateCard = async (req, res) => {
    const {_id} = req.body;
    try {
        const newCard = await Card.findByIdAndUpdate(_id, req.body);
        return res.status(201).json(newCard);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}




export const updateItems = async (req, res) => {
    const items = req.body;
    try {
        let newItems = items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            switch (item.type) {
                case "image":
                    
                    break;
                case "text":
                    var isText = await Text.findById(item._id);
                    if(isText){
                        const newText = await Text.findByIdAndUpdate(item._id, {ru: item.text.ru, kz: item.text.kz, en: item.text.en, all: item.text.all}, {new: true});
                        newItems[i].text = newText;
                    }
                    else{
                        const isPage = await Page.findById(item._id)
                        if(isPage){
                            const newPage = await Page.findByIdAndUpdate(item._id, {[item.fieldname]: item.text}, {new: true});
                            newItems[i].text = newPage[item.fieldname];
                        }else{
                            const isCard = await Card.findById(item._id);
                            if(isCard){
                                const newCard = await Card.findByIdAndUpdate(item._id, {[item.fieldname]: item.text}, {new: true});
                                newItems[i].text = newCard[item.fieldname];
                            }else{
                                const isStaff = await Staff.findById(item._id);
                                if(isStaff){
                                    const newStaff = await Staff.findByIdAndUpdate(item._id, {[item.fieldname]: item.text}, {new: true});
                                    newItems[i].text = newStaff[item.fieldname];
                                }
                            }
                        }
                    }
                    break
                case "singleText":
                    var isText = await Text.findById(item._id);
                    if(isText){
                        const newText = await Text.findByIdAndUpdate(item._id, {all: item.singleText}, {new: true});
                        newItems[i].singleText = newText.all;
                    }else{
                        const isPage = await Page.findById(item._id)
                        if(isPage){
                            const newPage = await Page.findByIdAndUpdate(item._id, {[item.fieldname]: item.singleText}, {new: true});
                            newItems[i].singleText = newPage[item.fieldname];
                        }else{
                            const isCard = await Card.findById(item._id);
                            if(isCard){
                                const newCard = await Card.findByIdAndUpdate(item._id, {[item.fieldname]: item.singleText}, {new: true});
                                newItems[i].singleText = newCard[item.fieldname];
                            }else{
                                const isStaff = await Staff.findById(item._id);
                                if(isStaff){
                                    const newStaff = await Staff.findByIdAndUpdate(item._id, {[item.fieldname]: item.singleText}, {new: true});
                                    newItems[i].singleText = newStaff[item.fieldname];
                                }
                            }
                        }
                    }
                    break;
            }   
        }
        return res.json(newItems);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}


export const createStaff = async (req, res) => {
    try {
        let image = null;
        if(req.file){
            const newImg = await Image.create({src: req.file.filename});
            image = newImg._id;
        }

        const staff = await Staff.create({...req.body, image: image});
        return res.status(200).json(staff);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}

export const updateStaff = async (req, res)=>{
    const data = JSON.parse(req.body.data);
    const {id} = req.params;
    try {
        const existingStaff = await Staff.findById(id);
        if(!existingStaff)
            return req.status(404).json({error: "Staff does not exist"});
        let image = data.image;
        if(req.file){
            const newImg = await Image.create({src: req.file.filename});
            image = newImg._id;
        }
        const newStaff = await Staff.findByIdAndUpdate(id, {...data, image: image}, {new: true});
        return res.status(201).json(newStaff); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."}); 
    }
}