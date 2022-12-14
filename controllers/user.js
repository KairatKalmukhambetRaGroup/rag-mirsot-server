import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Company from "../models/company.js";
import generator from 'generate-password';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars'
import handlebars from 'handlebars';
import Role from '../models/role.js';
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'qashqyn291@gmail.com',
            pass: 'ytgxtoqhfhumfmbp',
         },
    secure: true,
    });
const hbsOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./public/pages'),
        defaultLayout: false
    },
    viewPath: path.resolve('./public/pages'),
    extName: '.handlebars',
};
transporter.use('compile', hbs(hbsOptions));

export const login = async (req, res) => {
    const {email, password, remember} = req.body;

    try {
        const existingUser = await User.findOne({email}).populate('role').populate('companies');
        if(!existingUser)
            return res.status(404).json({error: "User does not exist."});
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect)
            return res.status(401).json({error: "Invalid credentials."});
        let expireTime = "6h";
        if(remember)
            expireTime = "30d";
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.TOKEN_KEY, {expiresIn: expireTime});
        
        return res.status(200).json({user: existingUser, token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role');
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const addUser = async (req, res) => {
    const {email} = req.body;
    
    // const filePath = path.join(__dirname, '../public/pages/newAdmin.html');
    const source = fs.readFileSync('./public/pages/newAdmin.html', 'utf-8').toString();
    const template = handlebars.compile(source);


    try {
        const existingUser = await User.findOne({email});
        if(existingUser) 
        return res.status(409).json({error: "User already exist."});
        
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({...req.body, password: hashedPassword});
        await user.save();  
        const replacements = {
            email: email,
            password: password
        };
        const htmlToSend = template(replacements);

        const mailData = {
            from: 'qashqyn291@gmail.com',
            to: email,
            subject: 'Account creation',
            text: `Username: ${email}\nPassword: ${password}`,
            html: htmlToSend
        };
        transporter.sendMail(mailData, (err, info)=>{
            if(err)
                console.log(err);
        });

        return res.status(200).json();      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const addCompany = async (req, res) => {
    const {email, companyName} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) 
            return res.status(404).json({error: "User does not exist."});

        if(!companyName)
            return res.status(400).json({error: "Missing or invalid required parameter"})

        const company = await Company.findOne({name: companyName});
        if(!company)
            return res.status(404).json({error: "Company does not exist."});

        await User.findByIdAndUpdate(existingUser._id, {$addToSet: {companies: company.id}});
        return res.status(200).json();      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const resetPassword = async (req, res)=>{
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) 
            return res.status(404).json({error: "User does not exist."});
        const password = generator.generate({
            length: 10,
            numbers: true
        });
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.findByIdAndUpdate(existingUser._id, {password: hashedPassword});
        const mailData = {
            from: 'qashqyn291@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: '',
            html: `<br>Your password: ${password}<br/>`,
        };
        transporter.sendMail(mailData, (err, info)=>{
            if(err)
                console.log(err);
        });
        return res.status(200).json();      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}


export const changePassword = async (req, res)=>{
    const {oldPassword, newPassword} = req.body;
    try {
        const existingUser = await User.findById(req.userId);
        if(!existingUser) 
            return res.status(404).json({error: "User does not exist."});
        
        // const 
        const matches = await bcrypt.compare(oldPassword, existingUser.password);
        if(!matches)
            return res.status(400).json({error: "Password does not match"});
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(existingUser._id, {password: hashedPassword});

        return res.status(200).json();      
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const deleteUser = async (req, res)=>{
    const {id} = req.params;
    try {
        const existingUser = await User.findById(id);
        if(!existingUser) 
            return res.status(404).json({error: "User does not exist."});
        await User.findByIdAndRemove(id);
        const users = await User.find().populate('role');
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});       
    }
}