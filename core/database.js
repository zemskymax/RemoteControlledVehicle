var mongoose = require('mongoose'),
    fs = require('fs'),
    models_path = process.cwd() + '/models';


//load all the models
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) {
        require(models_path + '/' + file);
    }
});

mongoose.connect(config.db.mongoUrl, config.db.options);
var db = mongoose.connection;

db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});

db.once('open', function callback() {
    console.info('MongoDB connection is established');
});

db.on('disconnected', function() {
    console.error('MongoDB disconnected!');
    mongoose.connect(config.db.mongoUrl, config.db.options);
});

db.on('reconnected', function () {
    console.info('MongoDB reconnected!');
});
