import Visitor from '../models/visitor.js';

export const addVisitor = async (req, res) => {
    const {ip, date} = req.body;
    try {
        const isExist = await Visitor.findOne({ip: ip, date: date});
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
};

export const getVisitors = async (req, res) => {
    try {
        await Visitor.aggregate([
            {
                $group:{
                    _id: "$date",
                    total: {$sum: 1}
                }
            },{
                $sort: {_id: 1}
            }
        ]).then((result) => {
            return res.json(result);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

export const getVisitorsInRange = async (req, res) => {
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
        const today = await Visitor.countDocuments({createdAt: {$gte: todayDate, $lt: tomorrowDate}});

        await Visitor.aggregate([
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