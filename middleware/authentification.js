const jwt = require('jsonwebtoken');

// middleware pour vérifier le token

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    console.log(token);

    if (!token) {
        return res.status(401).send('token manquant');
    }
    const decryptToken = jwt.verify(token, process.env.secret_key);
    req.user = decryptToken;
    next();
 }