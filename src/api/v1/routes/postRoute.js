const express=require('express');
const router=express.Router()
const postController=require('../controllers/postController')


router.get('/get',postController.getPost)
router.post('/create',postController.createPost)

module.exports=router