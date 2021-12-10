const {
    create,
    checkUser
} = require("../models/users.model");

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        checkUser(body.mobile, (errresults, chkresults) => {
            if (errresults) {
                return res.status(500).json({
                    errors: [{
                        status: errresults.code,
                        code: errresults.errno,
                        message: errresults.message
                    }]
                });
            }
            if (chkresults.length === 0) {
                create(body, (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            errors: [{
                                status: err.code,
                                code: err.errno,
                                message: err.message
                            }]
                        });
                    }
                    if (results) {
                        let tokenGen = {
                            id: results.insertId,
                            name: body.name,
                            mobile: body.mobile
                        }
                        const accessToken = sign({ result: tokenGen }, process.env.JWT_ACCESS_KEY, {
                            algorithm: "HS256",
                            expiresIn: process.env.JWT_ACCESS_EXPIRY
                        });
                        const refreshToken = sign({ result: results }, process.env.JWT_REFRESH_KEY, {
                            algorithm: "HS256",
                            expiresIn: process.env.JWT_REFRESH_EXPIRY
                        });
                        res.cookie('spin_a', accessToken, { maxAge: 3_600_000, httpOnly: true, secure: true });
                        res.cookie('spin_r', refreshToken, { maxAge: 86_400_000, httpOnly: true, secure: true });
                        return res.status(200).json({
                            data: [{
                                success: 1,
                                message: "Register successfully"
                            }]
                        });
                    }
                });
            } else {
                return res.status(200).json({
                    errors: [{
                        status: "Conflict",
                        code: "409",
                        message: "User Already Exists."
                    }]
                });
            }
        });
    },
    loginUser: (req, res) => {
        const body = req.body;
        checkUser(body.mobile, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    errors: [{
                        status: "Unauthorized",
                        code: "401",
                        message: "Invalid Mobile or password"
                    }]
                });
            }
            if (results.length === 1) {
                const result = compareSync(body.password, results[0].password);
                if (result) {
                    results[0].password = undefined;
                    const accessToken = sign({ result: results }, process.env.JWT_ACCESS_KEY, {
                        algorithm: "HS256",
                        expiresIn: process.env.JWT_ACCESS_EXPIRY
                    });
                    const refreshToken = sign({ result: results }, process.env.JWT_REFRESH_KEY, {
                        algorithm: "HS256",
                        expiresIn: process.env.JWT_REFRESH_EXPIRY
                    });
                    res.cookie('spin_a', accessToken, { maxAge: 3_600_000, httpOnly: true, secure: true });
                    res.cookie('spin_r', refreshToken, { maxAge: 86_400_000, httpOnly: true, secure: true });
                    return res.json({
                        data: [{
                            success: 1,
                            message: "login successfully"
                        }]
                    });
                } else {
                    return res.json({
                        errors: [{
                            status: "Unauthorized",
                            code: "401",
                            message: "Invalid Password"
                        }]
                    });
                }
            } else {
                return res.json({
                    errors: [{
                        status: "Unauthorized",
                        code: "401",
                        message: "Invalid Mobile"
                    }]
                });
            }
        });
    }
};