const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');


//middleware pour la création d'un utilisateur
/*
on cree une instance User puis on appelle la fonction  validate () pour valider
le format de données du mot de passe 
si error égal a null en crypte le mot de passe et on l'enregistre user   dans la base de données 

*/
exports.Usersignup=(req,res)=>{
    const password="1235";
    const emailCrypt= crypto.createHmac('sha256',password).update(req.body.email).digest('hex');
    const user=new User({
        email:emailCrypt,
        password:req.body.password
    });
    user.validate((error)=>{
        if(error){
                console.log( {error:error._message});
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
    const email=crypto.createHmac('sha256',password).update(req.body.email).digest('hex');
  User.findOne({email:email}, async function(error,user){
    if(error){
        console.log(error);
            return res.json({message:"email existe deja"});
    }else{
        if(!user){
            return res.status(400).json({message:"NOT FOUND USER"});

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
                     return res.status(400).json({message:"mot de passe incorrectes"});
                }
        }
    }
});

}
 