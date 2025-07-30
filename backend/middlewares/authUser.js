import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if(!token){
            return res.json({success: false, message: 'Not Authorised, Please Login'})
        }

        const decode_token = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {id : decode_token.id}

        next()
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Not Authorised, login again"
        })
    }
}

export default authUser