const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into users(full_name, mobile, password) 
                values(?,?,?)`,
            [
                data.name,
                data.mobile,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    checkUser: (mobile, callBack) => {
        pool.query(
            `select * from users where mobile=?`,
            [mobile],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};