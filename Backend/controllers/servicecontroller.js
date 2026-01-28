const jobModel = require('../model/serviceModel');

const createService = async(req,res)=>{
    try{
        const {service,description,location,price} = req.body;
        if(!service || !description || !location || !price){
            return res.status(400).json({message:"All fields are required"});
        }

        const newService = await jobModel.create({
            service,
            description,
            location,
            price,
            UserId: req.user._id
        });

        return res.status(201).json({
            message:"Service created successfully",
            data:newService
        });

    }catch(error){
        return res.status(500).json({message:"Something went wrong", error: error.message});
    }   

}
exports.createService = createService;



const getAllServices = async(req,res)=>{
    try{
        const services = await jobModel.find().populate("UserId","username email");

        return res.status(200).json({
            message:"Services fetched successfully",
            data:services
        });

    }catch(error){
        return res.status(500).json({message:"Something went wrong", error: error.message});
    }
}
exports.getAllServices = getAllServices;




const getSingleService = async(req,res)=>{
    try{
        const serviceId = req.params.id;

        const service = await jobModel.findById(serviceId).populate("UserId","username email");
        if(!service){
            return res.status(404).json({message:"Service not found"});
        }

        return res.status(200).json({
            message:"Service fetched successfully",
            data:service
        });

    }catch(error){
        return res.status(500).json({message:"Something went wrong", error: error.message});
    }
}
exports.getSingleService = getSingleService;




const updateService = async(req,res)=>{
    try{
        const serviceId = req.params.id;
        const {service,description,location,price} = req.body;

        const job = await jobModel.findById(serviceId);

        if(!job){
            return res.status(404).json({message:"Job not found"});
        }

        if(job.UserId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to update this job"});
        }

        // job.title = title || job.title;
        // job.description = description || job.description;
        // job.location = location || job.location;
        // job.salary = salary || job.salary;
        // job.company = company || job.company;

        // await job.save();

        // Alternatively, using findByIdAndUpdate

        const updatedService = await jobModel.findByIdAndUpdate(serviceId, {
            service,
            description,
            location,
            price
        }, { new: true });

        return res.status(200).json({
            message:"Service updated successfully",
            data:updatedService
        });

    }catch(error){
        return res.status(500).json({message:"Something went wrong", error: error.message});
    }
}

exports.updateService = updateService;


const deleteService = async(req,res)=>{
     try{
            const serviceId = req.params.id;

            const service = await jobModel.findById(serviceId);

            if(!service){
                return res.status(404).json({message:"Service not found"});
            }

            if(service.UserId.toString() !== req.user._id.toString()){
                return res.status(403).json({message:"You are not authorized to delete this service"});
            }

            await jobModel.findByIdAndDelete(serviceId);

            return res.status(200).json({
                message:"Service deleted successfully"
            });

        }catch(error){
            return res.status(500).json({message:"Something went wrong", error: error.message});
        }
}
exports.deleteService = deleteService;

