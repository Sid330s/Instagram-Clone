const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,HOST} = require('../config/keys')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

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


router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"PLEASE ADD ALL THE FIELDS !!!"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"INVALID EMAIL OR PASSWORD !!!"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               console.log(token)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"INVALID EMAIL OR PASSWORD !!!"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
             console.log(err)
         }
         const token = buffer.toString("hex")
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"User dont exists with that email"})
             }
             user.resetToken = token
             user.expireToken = Date.now() + 3600000
             user.save().then((result)=>{
                 transporter.sendMail({
                     to:user.email,
                     from:"siddharthvaidon@gmail.com",
                     subject:"password reset",
                     html:`
                     <p>You requested for password reset</p>
                     <h5>click in this <a href="${HOST}/reset/${token}">link</a> to reset password</h5>
                     `
                 })
                 res.json({message:"check your email"})
                 console.log("Mail Sent!!")
             })

         })
     })
})


module.exports = router
