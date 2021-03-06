const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');


//middleware pour la création d'un utilisateur
/*
On verifie le format de l'email puis on le crypte et 
on cree une instance User puis on appelle la fonction  validate () pour valider
le format de données du mot de passe et l'unicité de l'adresse mail
si error égal a null en crypte le mot de passe et on l'enregistre user   dans la base de données 

*/
exports.Usersignup=(req,res)=>{
    const password="1235";
    let emailCrypt;
    const email= new RegExp(/^[a-z]+[.a-z0-9\-]+@[a-z]+[.][a-z]{2,}$/);
    if(req.body.email.match(email)){
        emailCrypt= crypto.createHmac('sha256',password).update(req.body.email).digest('hex'); 
    }else{
        return res.status(401).json({message:"l'email n\'est pas au bon format"});
    }
  
    const user=new User({
        email:emailCrypt,
        password:req.body.password
    });
    user.validate((error)=>{
        if(error){
                console.log("mon erreur");
                console.log( {error:error.message});
               
            res.status(422).json({message:error.message});
        }else{ 
           
           console.log("mon email est:"+user.email);
           user.password=bcrypt.hashSync(user.password,10);
           console.log("mon email est:"+user.password);
           user.save({validateBeforeSave:false})
           .then(()=>res.status(201).json({message:"le compte a été crée avec succes"}))
           .catch(error=>{
               console.log(error);
               res.status(500).json({message:error.message})});


           
    };
})
};
               

//middleware pour ce connecter à l'API
/*
*/
exports.userLogin= (req,res)=>{
    const password="1235";
    //on crypte l'email saisie par l'utilisateur avant de le sauvegarder dans la base de données 
    const email=crypto.createHmac('sha256',password).update(req.body.email).digest('hex');
  User.findOne({email:email}, async function(error,user){
    if(error){
        console.log(error);
            return res.status(500).json({message:error.message});
    }else{
        if(!user){
            return res.status(404).json({message:"NOT FOUND USER"});

        }else{
            let valid=await bcrypt.compare(req.body.password,user.password);
            console.log(req.body.password);
            console.log(user.password);
            console.log(valid);
            if(valid){
                res.status(200).json({
                    userId:user._id,
                    token:jwt.sign(
                        {userId:user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn:'24h'}
                    )
                    })
                }else{
                     return res.status(401).json({message:"mot de passe incorrectes"});
                }
        }
    }
});

}
 