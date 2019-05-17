var mongoose= require('mongoose');

var Schema= mongoose.Schema;

var Schema=new Schema({
    eventname:{type:String,unique:true,require:true},
    location:{type:String,require:true},
    capacity:{type:String,require:true},
    price:{type:String,require:true},
    doe:{type:String,require:true},
    type:{type:String,require:true},
    promotioncode:{type:String},
    created_by:{type:String,require:true}
});


module.exports=mongoose.model('Event',Schema);