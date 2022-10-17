var jwt = require('jsonwebtoken');


const fetchuser = (req, res, next) => {

    //Get the user form the jwt token and add id to req object

    const JWT_SECRET = "Jaiwi11becom3gr3atc0d34";

    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });

    }

}

module.exports = fetchuser;