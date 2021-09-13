const express=require('express');
const route=express.Router();
const controllerUser=require('../controllers/user');


//endpoint pour la creation d'un utilisateur
route.post('/signup',controllerUser.Usersignup);
 //endpoint pour se connecter 
 route.post('/login',controllerUser.userLogin);
 module.exports=route;