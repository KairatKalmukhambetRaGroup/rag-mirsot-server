import Consultation from "../models/consultation/request.js";
import moment from 'moment';


export const createConsultation = async (req, res) => {
    const {name, email} = req.body;
    
    try {
        if(!name || !email)
            return res.status(400).json({error: "Missing or invalid required parameter"});
        const consultation = new Consultation(req.body);
        await consultation.save();
        
        const date = new Date(new Date(consultation.createdAt).setUTCHours(0,0,0,0));
        const oneDay = (1000 * 60 * 60 * 24);
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
        const month = moment(date).format('MMMM');
        const year = moment(date).format('YYYY');
        
        const weekStart = new Date(date.valueOf() + oneDay * (1-dayOfWeek));
        const weekEnd = new Date(date.valueOf() + oneDay * (7-dayOfWeek));
        
        const week = moment(weekStart).format('DD/MM/YYYY') + " - " + moment(weekEnd).format('DD/MM/YYYY');
        
        await Consultation.findByIdAndUpdate(consultation._id, {date: moment(date).format('DD/MM/YYYY'), week, month, year});
        
        return res.status(201).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getConsultationYears = async (req, res) => {
    try {
        const years = await Consultation.find({status: 'archive'}).distinct('year');
        return res.json(years);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }   
}

export const getConsultations = async(req, res) => {
    const {status} = req.params;
    const {start, end, page: pg, year} = req.query;
    const page = pg ? pg : 1;

    const limit = 15;
    const skip = limit * (page-1);

    if(!status){
        return res.status(400).json({error: "Missing or invalid required parameter"});
    }
    
    try {
        if(status === 'new'){
            if(!start || !end)
                return res.status(400).json({error: "Missing or invalid required parameter"});
            const startDate = new Date(start);
            const endDate = new Date(new Date(new Date(end).setUTCHours(0,0,0,0)).valueOf() + 1000*60*60*24);
            // VALIDATE DATE
            if(!(startDate instanceof Date && !isNaN(startDate)) || !(endDate instanceof Date && !isNaN(endDate)) ||  startDate >= endDate)
                return res.status(400).json({error: "Missing or invalid required parameter"});
            const count = await Consultation.count({status, createdAt: {$gte: startDate, $lt: endDate}});
            const consultations = await Consultation.find({status, createdAt: {$gte: startDate, $lt: endDate}}).select('name email direction service lang').skip(skip).limit(limit).sort('-createdAt');
            const total = Math.ceil(count/limit);
            return res.json({consultations, page,total, limit, count});
        }else if(status === 'archive'){
            if(!year)
                return res.status(400).json({error: "Missing or invalid required parameter"});
            const count = await Consultation.count({year});
            const consultations = await Consultation.find({year}).select('name email direction service lang').skip(skip).limit(limit).sort('-createdAt');
            const total = Math.ceil(count/limit);
            return res.json({consultations, page,total, limit, count});
        }   
        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getAllArchiveByYear = async(req, res) => {
    const {year} = req.query;
    if(!year){
        return res.status(400).json({error: "Missing or invalid required parameter"});
    }
    
    try {
        const consultations = await Consultation.find({year}).select('name email direction service lang date').sort('-createdAt');
        return res.json(consultations);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getConsultationAnalytics = async(req, res) => {
    const {start, end, group} = req.query;

    let groupBy = '$date';
    switch (group) {
        case 'lastMonth':
            groupBy = '$week';
            break;
        case 'lastHalfYear':
        case 'lastYear':
            groupBy = '$month';
            break;
    }
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

        const todayDate = new Date((new Date().setUTCHours(0,0,0,0)));
        const tomorrowDate = new Date(todayDate.valueOf() + (1000 * 60 * 60 * 24));
        const today = await Consultation.countDocuments({createdAt: {$gte: todayDate, $lt: tomorrowDate}});

        await Consultation.aggregate([
            {
                $match: {createdAt: {$gte: startDate, $lt: endDate}}
            },
            {
                $group:{
                    _id: groupBy,
                    total: {$sum: 1}
                }
            },{
                $sort: {_id: 1}
            }
        ]).then((result) => {
            return res.json({today: today, analytics: result});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const archiveRequest = async(req, res)=>{
    const {id} = req.params;
    try {
        await Consultation.findByIdAndUpdate(id, {status: 'archive'});
        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});    
    }
}
export const deleteRequest = async(req, res)=>{
    const {id} = req.params;
    try {
        await Consultation.findByIdAndRemove(id);
        return res.json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});    
    }
}