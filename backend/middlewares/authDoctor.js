import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers

        if(!dtoken){
            return res.json({success: false, message: 'Not Authorised, Please Login'})
        }

        const decode_token = jwt.verify(dtoken, process.env.JWT_SECRET)

        req.doctor = {id : decode_token.id}

        next()
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Not Authorised, login again"
        })
    }
}

export default authDoctor