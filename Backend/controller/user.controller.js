import mongoose from "mongoose"
import userModel from '../model/user.model.js';   
import bcryptjs, { compare } from 'bcryptjs'
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";

export async function registerUser(req, res){
    try {
        const {name , email, password}= req.body;
        if(!name || !email|| !password){
            return res.status(400).json({
                message : "provide all required details",
                error : true,
                success : false, 
            })
        }
        const user = await userModel.findOne({email});
        if(user){
            return res.json({
                message :"already registered email",
                error : true,
                success: false,
                data : user,
            })
        }
        const salt= await bcryptjs.genSalt(10);
        const hashpassword= await bcryptjs.hash(password,salt); 
        const payload = {
            name,
            email,
            password : hashpassword
        }
        const newUser= new userModel(payload);
        const save= await newUser.save();


        return res.json({
            message : "user register successfully",
            error : false,
            success : true,
            data : save,
        })


        
    } catch (error) {
        return res.status(500).json({
            message : "something do error",
            error : true,
            success : false,
        })
        console.log(error)
        
    }
}

export async function loginUser(req, res) {
    try {
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                message : "provide all details",
                error : true,
                success : false,
            })
        }
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({
                message : "user is not registerd",
                error : true,
                success : false,
            })

        }
        const checkPassword = await bcryptjs.compare(
                password,
                user.password
            );
        if(!checkPassword){
            return res.status(400).json({
                message: "password is incorrect. check your password",
                error : true,
                success : false,
            })
        }

        const accessToken= await generatedAccessToken(user._id);
        const refresToken= await generatedRefreshToken(user._id);
        
        await userModel.findByIdAndUpdate(user._id, {
        last_login_date: new Date(),
        });

        const cookiesOption = {
        httpOnly: true,
        secure: false, // for local dev
        sameSite: "Lax",
        };

        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refresToken, cookiesOption);
        return res.json({
            message : "login Successfully",
            error : false,
            success : true,
            data : {
                user :{
                    _id : user._id,
                    email : user.email,
                    password : user.password,
                    name:user.name,
                    image : user.image 
                },
                accessToken,
                refresToken,
            }


        })
        
    } catch (error) {
        return res.status(400).json({
            message : "provide email and password",
            error : true,
            success: false,
        })
        
    }
    
}