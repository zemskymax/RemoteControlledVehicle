var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
	id : { type: String , unique: true , required: true},

    });