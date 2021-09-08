const mongoose=require('mongoose');
const validUnique=require('mongoose-unique-validator');
const pass=new RegExp(/^[A-Z][a-zA-Z]+[0-9]+[$!#&*]$/g);

//creation du model utilisateur unique
const userSchema=mongoose.Schema({

email:{type:String,required:true,unique:true},
password:{
    type:String,
    required:true,
    validate:[function(v){
        console.log(v);
            if(v.match(pass)){
                console.log(v);
                return true;
            }else{
                console.log(v);
                return false;
            }
      
    },"le mot de passe doit contenir une majuscule suivi des caractères alphanumeriques "+ 
    "et d'un caractère spécial:$&!#*"]
}

})
//on applique mongoose-unique-validator sur notre schema utlisateur
userSchema.plugin(validUnique,{message:" email saisie existe deja"});
module.exports=mongoose.model('User',userSchema);