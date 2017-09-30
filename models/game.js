var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var deviceModel = require('./device');

var gameSchema = new Schema({
	
	id: { type: String, unique: true, required: true },
	name: { type: String, default: 'Game' },
    ownerId: { type: String, required: true },
	devices: [ String ],
	active: { type: Boolean, default: false }
});

//TODo...
Game = mongoose.model('games', gameSchema);