const userController = require("../app/controller/userController");

function initRoutes(app) {
  //*********************************   API routes  **************************** *//
 
  // register user
  app.post("/register", userController().newUser);
  // login user
  app.post("/login", userController().loginUser);
}
module.exports = initRoutes;
