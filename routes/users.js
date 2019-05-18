var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
 var Users= require('../model/users');
 var Event= require('../model/event');
var EventBook=require('../model/book');

var bcrypt= require('bcrypt-nodejs');

router.get('/events',(req,res,next)=>{
  Event.find((error,data)=>{
    if(error){
      res.send({error:error})
       }
       else if(!data){
res.send({status:500,message:'no records found'})
       }
       else{
         res.send({status:200,message:'successful',data:data})
       }
  });
 
})
router.get('/user/:uid',(req,res,next)=>{
const id =  req.params.uid;
  Users.findOne({"_id":ObjectId(req.params.uid)},(error,user)=>{
    if(error){
      res.send({error:error})
    }else if(!user){
      res.status(500).send({status:500,message:'unsuccessful',data:error})

    }
    else{
      
      res.status(200).send({status:200,message:'successful',data:user,id:id})
    }
  })
})
//get event to update 
router.get('/updateevent/:eid',(req,res,next)=>{

  const id =  req.params.eid;
  Event.findOne({"_id":ObjectId(req.params.eid)},(error,event)=>{
      if(error){
        res.send({error:error})
      }else if(!event){
        res.status(500).send({status:500,message:'unsuccessful',data:error})
  
      }
      else{
        
        res.status(200).send({status:200,message:'successful',data:event})
      }
    })
  })
router.get('/myevents/:u_name',(req,res,next)=>{
  const username =  req.params.u_name;
    //  uid= new ObjectId(req.params.uid.toString());
    Event.find( { "created_by": username },(error,events)=> {
      if(error){
        res.send({error:error})
      }else if(!events){
        res.status(500).send({status:500,message:'unsuccessful',data:error})
  
      }
      else{
        
        res.status(200).send({status:200,message:'successful',data:events})
      }
    })
  })
  router.get('/myeventslist/:eventids',(req,res,next)=>{
      Event.findOne( { "_id":ObjectId(req.params.eventids)},(error,events)=> {
        if(error){
          res.send({error:error})
        }else if(!events){
          res.status(500).send({status:500,message:'unsuccessful',data:error})
    
        }
        else{
          
          res.status(200).send({status:200,message:'successful',data:events})
        }
      })
    })
  router.get('/mybookedevents/:u_name',(req,res,next)=>{
    const username =  req.params.u_name;
      //  uid= new ObjectId(req.params.uid.toString());
      EventBook.find( { "booked_by": username },(error,events)=> {
        if(error){
          res.send({error:error})
        }else if(!events){
          res.status(500).send({status:500,message:'unsuccessful',data:error})
    
        }
        else{
          
          res.status(200).send({status:200,message:'successful',data:events})
        }
      })
    })
//delete my event 
  router.delete('/eventdelete/:eid',(req,res,next)=>{
    // const username =  req.params.eid;
      Event.deleteOne( {"_id":ObjectId(req.params.eid)},(error,events)=> {
        if(error){
          res.send({error:error})
        }else if(!events){
          res.status(500).send({status:500,message:'unsuccessful',data:error})
        }
        else{
          res.status(200).send({status:200,message:'successful',data:events})
        }
      })
    })
    //delete mybookingevenst
    router.post('/deletemybookingevent',(req,res,next)=>{
      const eid=req.body.eid;
      const user=req.body.user;
        EventBook.deleteOne( {"eventId":eid,"booked_by":user},(error,events)=> {
          if(error){
            res.send({error:error})
          }else if(!events){
            res.status(500).send({status:500,message:'unsuccessful',data:error})
          }
          else{
            res.status(200).send({status:200,message:'successful',data:events})
          }
        })
      })
    //deleted booked event
    router.delete('/bookedeventdelete/:eid',(req,res,next)=>{
      // const username =  req.params.eid;
      EventBook.deleteMany( {"eventId":req.params.eid},(error,events)=> {
          if(error){
            res.send({error:error})
          }else if(!events){
            res.status(500).send({status:500,message:'unsuccessful',data:error})
          }
          else{
            res.status(200).send({status:200,message:'successful',data:events})
          }
        })
      })
    //delete my profile
    router.delete('/deleteprofile/:uid',(req,res,next)=>{
       Users.deleteOne( {"_id":ObjectId(req.params.uid)},(error,user)=> {
          if(error){
            res.send({error:error})
          }else if(!user){
            res.status(500).send({status:500,message:'unsuccessful',data:error})
          }
          else{
            res.status(200).send({status:200,message:'successful',data:user})
          }
        })
      })
router.post('/register',function(req,res,next){
addToDB(req,res)
});

async function addToDB(req,res){

   var users= new Users({
     email:req.body.email,
     username:req.body.username,
     password:Users.hashPassword(req.body.password),
     staff:req.body.staff,
     gender:req.body.gender,
     mobile:req.body.mobile,
     dob:req.body.dob,
     creation_dt:Date.now()
   });

   try{
     doc=await users.save(function(err){
       if(err)
     {
     return  res.send(err);
     }
     return res.json({message:"successfull registartion",status:200,data:doc})
     });
    //  return res.status(200).json(doc);
   }
   catch(err){
     return res.status(501).json(err);
   }
}
router.post('/bookevent',function(req,res){
  bookEvent(req,res);
})
async function bookEvent(req,res){
  var bEvent=new EventBook({
    eventId:req.body.eid,
    userId:req.body.uid,
    booked_by:req.body.booked_by
  });
  try{
    doc=await bEvent.save(function(err){
      if(err){
        return res.send(err);
      }
    return res.json({message:"event successfull booked",status:200,data:doc})

    })
  }
  catch(err){
    return res.status(501).json(err);
  }
}
router.post('/regEvent',function(req,res){
  addtoEvent(req,res);

})
async function addtoEvent(req,res){
  var event= new Event({
    eventname:req.body.eventname,
    location:req.body.location,
    capacity:req.body.capacity,
    type:req.body.type,
    doe:req.body.doe,
    price:req.body.price,
    promotioncode:req.body.promo,
    created_by:req.body.username
    });

  try{
    doc=await event.save(function(err){
      if(err)
    {
    return  res.send(err);
    }
    return res.json({message:"event successfull creation",status:200,data:doc})
    //  return res.status(200).json(data);
    });
  }
  catch(err){
    return res.status(501).json(err);
  }
}
router.post('/login', function(req,res,next){
  let userData=req.body

  Users.findOne({username:userData.email},(error,user)=>{
    if(error){
      console.log(error)
    }else{
      if(!user){
        res.status(200).send({status:401,message:'Invalid username'})
      }
      else{
        bcrypt.compare(userData.password,user.password,(err, result) => {
          if (result) {
        res.status(200).send({status:200,message:'successs',userId:user._id})
        console.log('bcrypt - error - ', err);
          } else {
        res.status(401).send({ status:401, message:'invalid credinatials'})
          }
        })
        }
         
      }
    }
  )
})
router.put('/updatingevent',(function(req,res,next){
  let eid=req.body.edi;
  Event.update({
    "_id":ObjectId(eid)},
    {$set:{"eventname":req.body.eventname,"location":req.body.location,
"capacity":req.body.capacity,"price":req.body.price,"doe":req.body.doe,
"type":req.body.type,"promotioncode":req.body.promo
}},(error,event)=>{
  if(error){
    res.send(error);
  }
  else if(!event){
    res.send({
      status:500,message:"unsuccessful"
    })
  }
  else{
    res.send({status:200,message:"success",data:event});
  }
})
}))

router.put('/updatingprofile',(function(req,res,next){
  let uid=req.body.uid;
  Users.update({
    "_id":ObjectId(uid)},
    {$set:{"username":req.body.username,"email":req.body.email,
"gender":req.body.gender,"mobile":req.body.mobile,"dob":req.body.dob,
"staff":req.body.staff
}},(error,user)=>{
  if(error){
    res.send(error);
  }
  else if(!user){
    res.send({
      status:500,message:"unsuccessful"
    })
  }
  else{
    res.send({status:200,message:"success",data:user,error:error});
  }
})
}))
module.exports = router;
