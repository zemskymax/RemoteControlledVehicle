var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    id: { type: String, unique: true, required: true },
    type: { type: String,  default: "Vehicle" },
    gameId: { type: String, required: true },
    ownerId: { type: String, required: true } ,
    available: { type: Boolean,  default: true }
});

//TODo...
Device = mongoose.model('devices', deviceSchema);