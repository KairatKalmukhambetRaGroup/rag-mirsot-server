import Language from '../models/lang.js';

// export const addLang = async (req, res) => {
//     const {name, title} = req.body;
//     if(!name || !title)
//         return res.status(400).json({error: "Missing or invalid required parameter"});
//     try {
//         const existingLang = await Language.findOne({$or: [{'name': name}, {'title': title}]});
//         if(existingLang)
//             return res.status(409).json({error: "Language already exist."});
//         const newLang = new Language(req.body);
//         await newLang.save();

//         const langs = await Language.find();
//         return res.json(langs);

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error: "Something went wrong."});
//     }
// }
export const getLangs = async (req, res)=>{
    try {
        const langs = await Language.find({isOn: true});
        return res.json(langs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}

// export const toggleLang = async (req, res) => {
//     const {name} = req.params;
//     if(!name)
//         return res.status(400).json({error: "Missing or invalid required parameter"});
//     try {
//         const existingLang = await Language.findOne({name});
//         if(!existingLang)
//             return res.status(409).json({error: "Language does not exist."});
//         await Language.findByIdAndUpdate(existingLang._id, {isOn: !existingLang.isOn});
        
//         const langs = await Language.find();
//         return res.json(langs);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error: "Something went wrong."});
//     }
// }
export const toggleLanguages = async (req, res) => {
    const {langs} = req.body;
    if(!langs)
        return res.status(400).json({error: "Missing or invalid required parameter"});
    try {
        var count = 0;
        for (const name in langs) {
            if (Object.hasOwnProperty.call(langs, name) && langs[name]) 
                count++;
        }
        if(count===0)
            return res.status(400).json({error: "Missing or invalid required parameter"});
        for (const name in langs) {
            if (Object.hasOwnProperty.call(langs, name)) {
                const isOn = langs[name];
                const existingLang = await Language.findOne({name});
                if(existingLang){
                    await Language.findByIdAndUpdate(existingLang._id, {isOn});
                }           
            }
        }
        
        const newLangs = await Language.find();
        return res.json(newLangs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Something went wrong."});
    }
}