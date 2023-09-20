require('dotenv').config()
const express =require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express();


// ************************  Database Connection  **********************************//
const {connectMonggose} = require('./app/database/db')
connectMonggose();


//*****************************  Session config   ************************************//
app.use(session({
    secret:  process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))


// *************************    Assets    ****************************************//
const publicPath = path.join(__dirname,"public");
app.use(express.static(publicPath));
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

// ***********************************Routes ********************************//
require('./routes/api')(app)
require('./routes/articleRoutes')(app)

// ************************   Port Start   ********************************//
const PORT = process.env.PORT || 8500;
app.listen(PORT,()=>{
    console.log(`My server start on this port ${PORT}`)
})


// Article Saving Routes:

// /save-article: POST request to save an article for later reading. Requires authentication.
// /saved-articles: GET request to retrieve a list of saved articles. Requires authentication.
// /saved-articles/:articleId: DELETE request to remove a saved article by its ID. Requires authentication.
// Article Recommendation Routes:

// /recommended-articles: GET request to retrieve recommended articles based on user reading habits. Requires authentication.