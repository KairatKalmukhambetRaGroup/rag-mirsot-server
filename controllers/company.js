import Company from "../models/company.js";

export const createCompany = async (req, res) => {
    const {name} = req.body;

    try {
        const existingCompany = await Company.findOne({name});
        if(existingCompany)
            return res.status(409).json();

        const company = new Company({name});
        await company.save();

        return res.status(200).json(company);
    } catch (error) {
        console.log(error);
        return res.status(500).json();
    }
}

export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.status(200).json(companies);      
    } catch (error) {
        console.log(error);
        return res.status(500).json();
    }
}
