const sauces = require('../models/sauces');
const Sauce=require('../models/sauces');
const user = require('../models/user');
//on importe le package fs de node
const fs=require('fs');


//middleware pour recuperer le tableau des sauces dans la base de données
exports.getAllSauces=(req,res)=>{
    Sauce.find().then(sauces=>res.status(200).json(sauces))
    .catch(error=>res.json.json({error}));
}
//ajouter une sauce
exports.createSauces=(req,res)=>{
    const sauceObject=JSON.parse(req.body.sauce);
    const sauce=new Sauce({
        userId:sauceObject.userId,
        name:sauceObject.name,
        manufacturer:sauceObject.manufacturer,
        description:sauceObject.description,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        
        mainPepper:sauceObject.mainPepper,
        heat:sauceObject.heat,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[]

    });
    sauce.validate(error=>{
        if(error){
            const fichier=sauce.imageUrl.split('/images/')[1];
         
            console.log(fichier);
            const path=`./images/${fichier}`;
            console.log(path);
            fs.unlink(path,()=>{
            
            return res.status(400).json({message:error.message});
            })
        }else{
            console.log(sauce);
            
          sauce.save()
          .then(()=>res.status(201).json({message:'la sauce a été crée avec succes'})) 
          .catch(error=>res.status(500).json({message:error.message})); 

        }
    })
  
}
exports.getOneSauce=(req,res)=>{
   Sauce.findOne({_id:req.params.id})//on recupere la valeur de l'id avec params
    .then(sauce=>res.status(200).json(sauce))//on envoie la sauce en front-end
    .catch(error=>res.status(404).json({error}))//on envoie un code d'errreur

}
//modifier les sauces
exports.updateSauce=(req,res)=>{
const sauceObject=req.file ?
{
    ...JSON.parse(req.body.sauce),
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
}:
{   
   ...req.body
};

Sauce.updateOne(
    {_id:req.params.id},
    {...sauceObject,_id:req.params.id},
    {runValidators:true},function(error){//on verifie les données saisies par l'utilisateur  
        if(error){
            return res.status(400).json({message:error.message});
        }else{
            res.status(200).json({message:"la sauce a été modifiée avec succes"});
        }


});
    


}
//middleware pour supprimer une sauce 
exports.deleteSauce=(req,res)=>{
    Sauce.findOne({_id:req.params.id},(error,sauce)=>{
        if(error){
            res.status(404).json({message:error.message});
        }else{
         const fichier=sauce.imageUrl.split('/images/')[1];
         
         console.log(fichier);
         const path=`./images/${fichier}`;
         console.log(path);
         fs.unlink(path,()=>{
            Sauce.deleteOne({_id:req.params.id})
            .then(()=>res.status(200).json({message:"la sauce a été supprimé"}))
            .catch(error=>res.status(400).json({message:error.message}));
         })
       
        }
        
        
        
        
        
})
     
    
};
//middleware likeSauce pour sauvegarder les notations de utilsateurs
  exports.likeSauce=(req,res,next)=>{
    Sauce.findById({_id:req.params.id})
    .then(sauce=>{ 
       
    switch(req.body.like){
       
        
        case 1:
            /*
             on ajouter  l'identifiant de l'user dans le tableau 
               usersLkes et on incremente la valeur de likes 
           */
                       sauce.usersLiked.push(req.body.userId);
                             sauce.likes++;
                             console.log("aime la sauces");
                             console.log(sauce);
                             sauce.save();
                            res.json({message:"like"});
                     break;

        case 0:
           /*on parcours les  deux tableaux users en verifiant 
           si l'utilisateur existe dans l'un ou l'autre .Si l'user existe dans l'un des tableau  on le supprime et 
           on decrimente la valeur de likes ou dislikes puis on sauvegarde  la sauce
           */
            
            for(let i=0;i<sauce.usersLiked.length;i++){
                if(sauce.usersLiked[i]===req.body.userId){
                   sauce.usersLiked.splice(i,1);
                    sauce.likes--;}
        }
        for(let i=0;i<sauce.usersDisliked.length;i++){
            if(sauce.usersDisliked[i]===req.body.userId){
               sauce.usersDisliked.splice(i,1);
                sauce.dislikes--;}
    }
         
            console.log("vous avez annulé votre choix");
            console.log(sauce);
            sauce.save();
            res.json({message:"delete"});
            break;

        case -1:
            /* 
                  on ajouter  l'identifiant de l'user dans le tableau 
               usersDislikes et on incremente la valeur de dislikes 
            */
                        sauce.usersDisliked.push(req.body.userId);
                        sauce.dislikes++;
                        console.log("vous n'aime pas  la sauce");
                        console.log(sauce);
                        sauce.save();
                       res.json({message:"dislike"});
                    
            break;



    }
         
});
  }
