const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const UserModel = require('./model/user-model');

mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

var options = {
	key: fs.readFileSync('../secrets/privkey.pem'),
	cert: fs.readFileSync('../secrets/fullchain.pem')
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/priv', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
app.use(function(err, req, res, next) {
    console.log(err);
	res.status(err.status || 500);
	res.json({ error: err, errorString: err.toString() });
});

https.createServer(options, app).listen(3000, () => {
	console.log('Server started.')
});
