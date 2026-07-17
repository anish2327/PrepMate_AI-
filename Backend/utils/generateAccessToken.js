import UserModel from '../model/user.model.js'
import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken'

console.log('Access Key:', process.env.SECRET_KEY_ACCESS_TOKEN);


const generatedAccessToken = async (userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn : '5h'}
    )

    return token;
}

export default generatedAccessToken