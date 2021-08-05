const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')


router.post('/signup',(req,res)=>{
  const {name,email,password,pic} = req.body
  if(!email || !password || !name){
     return res.status(422).json({error:"PLEASE ADD ALL THE FIELDS !!!"})
  }
  User.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"USER WITH THE EMAIL ALREADY EXISTS !!!"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })

            user.save()
            .then(user=>{
                res.json({message:"SAVED SUCCESSFULLY !!!"})
            })
            .catch(err=>{
                console.log(err)
            })
      })

  })
  .catch(err=>{
    console.log(err)
  })
})

module.exports = router
