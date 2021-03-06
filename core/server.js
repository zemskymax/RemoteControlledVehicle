var express = require('express');
var bodyParser  = require('body-parser');
var fs = require("fs-extra");
env = process.env.NODE_ENV || 'development';
socket = require('./sockets.js');

//global variables
devices = {};
clients = {};

routing_data = {};

app = express();
var http = require('http').Server(app);
socket.init(http);

app.use(express.static(process.cwd() + '/public'));

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, uid");
  next();
});

var port = process.env.PORT || 3000;
app.set('port', port);

app.locals.name = 'DroneController';

//get all the controllers in the controllers folder
console.log("loading controllers");
var controllers = { }, controllers_path = process.cwd() + '/controllers';
fs.readdirSync(controllers_path).forEach(function (file) 
{
    if (file.indexOf('.js') != -1) 
    {
		//import all the modules
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
        console.log(file);
    }
});

process.on("uncaughtException", function(err) 
{
	console.log({data:'uncaughtException', error: err.stack}); 
});

http.listen(app.get('port'), function() 
{
	console.log(app.locals.name + ' server running...');
	console.log('Port: ' + app.get('port'));
	console.log('Mode: ' + env );
	console.log(new Date());
});

//default
app.get('/', function(req,res,next)
{ 
	console.log('On');
	res.json({msg:['main page']});
});

app.get('/*', function(req, res) 
{
    console.log('page not found, url: ', req.url);
    res.json({ msg: ['page not allowed ' + app.locals.name] });
});

//game 
app.post('/game/createGame', controllers.gameController.create_game);
app.post('/game/startGame', controllers.gameController.start_game);
app.post('/game/getAllGames', controllers.gameController.get_all_games);

//device
app.post('/device/connectDevice', controllers.deviceController.connect_device);
app.post('/device/getGameDevices', controllers.deviceController.get_game_devices);

//user
app.post('/user/register', controllers.usersController.register_user);
app.post('/user/order', controllers.usersController.order);
