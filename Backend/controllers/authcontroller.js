const mongoose = require('mongoose');
const authModel = require('../model/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async(req,res)=>{
    try{
     const {username,password,email,phone,role} = req.body;

     console.log(req.body);
     
     if(!username || !password || !email || !phone){
        return res.status(400).json({message:"All fields are required"});
     }

     //find [{},{},{}]
     const userExists = await authModel.findOne({email})
        if(userExists){
            return res.status(409).json({message:"User already exists"});
        }

        const newUser = await authModel.create({
            username,
            email,
            phone,
            password: bcrypt.hashSync(password, 10),
            role
        });

     return res.status(201).json({
        message:"User registered successfully",
        data:newUser
     })

    }catch(err){
        return res.status(500).json({message: err.message});
    }
      
}

const login = async(req,res)=>{
    //login logic here
    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    const user = await authModel.findOne({email});
   

    console.log(user)
   
    // if(user.email !== email){
    //     return res.status(401).json({message:"email EMAIL is incorrect"});
    // }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if(!isPasswordValid || user.email !== email){
        return res.status(401).json({message:"email or password is incorrect"});
    }

    const token = jwt.sign({ id: user._id, email: user.email, phone: user.phone, role: user.role }, "helloworld", { expiresIn: "1h" });
    user.token = token;

    return res.status(200).json({
        message:"Login successful",
        data:user,
         token: token
    })

}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Forgot password request for email:", email);

    try {
      const user = await authModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("OTP generated:", otp);

      user.otp = otp;
      await user.save();

      await sendEmail({
        email,
        subject: "Password Reset OTP",
        message: `Your OTP for password reset is: ${otp}`,
      });

      return res.status(200).json({
        message: "OTP sent to email",
        consoleLog: `OTP for ${email} is ${otp}`,
      });
    }
     catch (err) 
     {
      console.error("Failed to process forgot password:", err.message);
      return res.status(500).json({ message: "Failed to send OTP" });
     }
   };

module.exports = {register, login, forgotPassword};