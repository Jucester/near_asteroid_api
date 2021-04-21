const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Read token in header
    const token = req.header('x-auth-token');
    // Also check if user is trying to access by oauth
    const access_token = req.session.access_token;

    //Validate if token or access_token exists
    if(!token && !access_token) {
        return res.status(401).json({
            messaege: 'Unauthorized'
        });
    }

    try {
        const cipher = jwt.verify(token, process.env.SECRET);
  
        if(!cipher) {
            return res.status(401).json({
                message: 'Invalid token'
            })
        }

        req.user = cipher.user;
        next(); 

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}