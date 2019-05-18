var mongoose= require('mongoose');

var Schema= mongoose.Schema;
var bcrypt= require('bcrypt-nodejs');

var Schema=new Schema({
    email:{type:String,unique:true,require:true},
    username:{type:String,require:true},
    staff:{type:String,require:true},
    password:{type:String,require:true},
    creation_dt:{type:Date,require:true},
    dob:{type:String,require:true},
    mobile:{type:Number,require:true},
    gender:{type:String,require:true}
});

Schema.statics.hashPassword=function hashPassword(password){
    var salt = bcrypt.genSaltSync(10);
// var hash = bcryptNodejs.hashSync("bacon", salt);
// console.log(hash);
    return bcrypt.hashSync(password,salt);
}


Schema.method.isValid= function (hashedpassword){
    return bcrypt.compareSync(hashedpassword,this.password);
}

module.exports=mongoose.model('users',Schema);