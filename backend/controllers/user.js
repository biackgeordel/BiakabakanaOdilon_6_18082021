const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


//middleware pour la création d'un utilisateur
/*
on cree une instance User puis on appelle la fonction  validate () pour valider
le format de données du mot de passe 
si error égal a null en crypte le mot de passe et on l'enregistre user   dans la base de données 

*/
exports.Usersignup=(req,res)=>{
    const user=new User({
        email:req.body.email,
        password:req.body.password
    });
    user.validate((error)=>{
        if(error){
            res.status(422).json({message:error.message});
        }else{
            user.email=bcrypt.hashSync(user.email,10);
            user.password=bcrypt.hashSync(user.password,10);
            console.log('user bcrypt'+user);
            user.save({validateBeforeSave:false})
            .then(()=>res.status(201).json({message:"compte crée avec succes"}))
            .catch(error=>res.json({message:error.message}));    
            }
        })
    };
               

//middleware pour ce connecter à l'API
/*
*/
exports.userLogin= (req,res)=>{
    let validEmail,ValidPassword;
    let userExist;
    User.find({},async (error,tabUser)=>{
            if(error){
                res.status(500).json({error});
            }else{
                console.log(tabUser);
                if(tabUser.length===0){
                return  res.status(404).json({message:"NOT EXIST USER"});
                }else{
                    for(let user of tabUser){
                        validEmail= await bcrypt.compare(req.body.email,user.email);
                        if(validEmail){
                           userExist=user;
                        }
                         
                    
                        }
                        if(userExist){
                             ValidPassword=await bcrypt.compare(req.body.password,userExist.password);
                            console.log(req.body.password);
                            console.log(userExist.password);
                            if(ValidPassword){
                                res.status(200).json({
                                    userId:userExist._id,
                                    token:jwt.sign(
                                        {userId:userExist._id},
                                        'RANDOM_TOKEN_SECRET',
                                        {expiresIn:'24h'}
                                    )
                                    })
                                }else{
                                     return res.status(400).json({message:"mot de passe incorrectes"});
                                }


                        }else{
                            return res.status(404).json({message:"NOT FOUND USER"});
                        }
                    
                }
            }

    
    });
    }

/*User.findOne({email:req.body.email}, async function(error,user){
    if(error){
            return res.json({error});
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
});*/


 