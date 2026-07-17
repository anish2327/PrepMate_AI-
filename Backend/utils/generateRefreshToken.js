import UserModel from "../model/user.model.js"
import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken'

console.log('Access Key:', process.env.SECRET_KEY_REFRESH_TOKEN);


const generatedRefreshToken = async (userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn : '7d'}
    )

    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id : userId},
        {
            refresh_token : token
        }
    )

    return token
}

export default generatedRefreshToken