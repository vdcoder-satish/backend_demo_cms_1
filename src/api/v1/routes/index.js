const express=require('express');
const router=express.Router()
const file_route=require('./postRoute')


router.use('/v1/post',file_route)
module.exports=router