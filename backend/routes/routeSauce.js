const express=require('express');
const route=express.Router();
const controllerSauces=require('../controllers/sauces');
const multer=require('../controllers/multer-config');
const auth=require('../controllers/auth');


//route pour obtenir toutes les  sauces dans la base de données
route.get('/',auth,controllerSauces.getAllSauces);

//route pour afficher une seule sauce
route.get('/:id',auth,controllerSauces.getOneSauce);

//route pour créer une sauce
route.post('/',auth,multer,controllerSauces.createSauces);

//route pour modifier la sauce
route.put('/:id',auth,multer,controllerSauces.updateSauce);
//route pour supprimer une sauce
route.delete('/:id',auth,controllerSauces.deleteSauce);
//route pour donner son avis concernant la sauce
route.post('/:id/like',auth,controllerSauces.likeSauce);


module.exports=route;