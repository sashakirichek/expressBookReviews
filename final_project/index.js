const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use(function auth(req, res, next) {
    console.log(req.url);
    next();
});

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(req.url);
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User need to login first" })
    }

    jwt.verify(req.session.authorization['accessToken'], "secure-secret", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        req.user = user;
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
