require('dotenv').config()
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var moment = require('moment');
moment().format();

function userController() {
  return {

    // Register User 
    async newUser(req, resp) {
      try {
        const { username, email, password } = req.body;
        // Validate input data
        if (!username || !email || !password) {
          return resp.status(400).json({ message: 'Missing required fields.' });
        }
        // Check if a user with the provided Email ID already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return resp.status(409).json({ message: 'User already exists with this Email ID Register' });
        } else {

          // Hash the password before storing it in the database
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          // Create the new User
          let createUser = await User.create({
            username,
            email,
            password: hashedPassword,
            date: moment().format('MMMM Do YYYY, h:mm:ss a')
          });
          createUser.save();
          createUser = createUser.toObject();
          delete createUser.password;
          resp.status(201).json({ data: { user: createUser } });
        }
      } catch (err) {
        resp.status(500).json({ error: "Failed User" });
      }
    },

    // Login User
    async loginUser(req, resp) {
      try {
        const { email, password } = req.body;
        console.log(req.body)

        // Validate input data
        if (!email || !password) {
          return resp.status(400).json({ message: 'Missing required fields.' });
        }

        // Check if a user with the provided name exists
        const userLogin = await User.findOne({ email });

        if (!userLogin) {
          return resp.status(404).json({ message: 'User not found' });
        }
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, userLogin.password);

        if (!passwordMatch) {
          return resp.status(401).json({ message: 'Invalid username or password' });
        }
        // Create and sign a JWT token
        const token = jwt.sign({ userID: userLogin._id ,userName:userLogin.username}, process.env.SECRET_KEY,{
          expiresIn: '24h', // You can adjust the token expiration as needed
        });
        return resp.status(200).json({
          message: 'User Login in successful',
          userID:userLogin._id,
          userName:userLogin.username,
          data: {
            token,
          },
        });
      } catch (error) {
        console.error('Error logging in:', error);
        resp.status(500).json({ message: 'Internal server error' });
      }
    },
  };
}
module.exports = userController;
