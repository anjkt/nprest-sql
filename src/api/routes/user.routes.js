const {
    createUser,
    loginUser
} = require("../controller/users.controller");

module.exports = function (router) {
    router.post("/users/register", createUser);
    router.post("/users/login", loginUser);
}