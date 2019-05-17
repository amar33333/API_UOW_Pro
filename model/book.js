var mongoose= require('mongoose');

var Schema= mongoose.Schema;

var Schema=new Schema({
    eventId:{type:String,require:true},
    userId:{type:String,require:true},
    booked_by:{type:String,require:true}
});


module.exports=mongoose.model('Book',Schema);