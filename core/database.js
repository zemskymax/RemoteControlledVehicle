var mongoose = require('mongoose'),
    fs = require('fs'),
    models_path = process.cwd() + '/models';
databaseConfig = require(process.cwd() + '/config/databaseConfig.js');
    
mongoose.Promise = require('bluebird');

//load all the models
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) {
        require(models_path + '/' + file);
    }
});

mongoose.connect(databaseConfig.db.mongoUrl, databaseConfig.db.options);
var db = mongoose.connection;

db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});

db.once('open', function callback() {
    console.info('MongoDB connection is established');
});

db.on('disconnected', function() {
    console.error('MongoDB disconnected!');
    mongoose.connect(databaseConfig.db.mongoUrl, databaseConfig.db.options);
});

db.on('reconnected', function () {
    console.info('MongoDB reconnected!');
});
