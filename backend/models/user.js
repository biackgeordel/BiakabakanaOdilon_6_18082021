const mongoose=require('mongoose');
const validUnique=require('mongoose-unique-validator');
//format du mot de passe
const pass=new RegExp(/^[A-Z][a-zA-Z]+[0-9]+[$!#&*]$/g);
/*creation du model utilisateur et 
personnalisation du message d'erreur concernant le format du mot de passe
*/
const userSchema=mongoose.Schema({

email:{type:String,required:true,unique:true},
password:{
    type:String,
    required:true,
    validate:[function(v){
        console.log('valeur de v:'+v);
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
/*on applique mongoose-unique-validator sur notre schema utlisateur
et on customise le message d'erreur afin d'éviter d'afficher le format d'email
stocké dans la base de données
*/
userSchema.plugin(validUnique,{message:" email saisie existe déja"});
module.exports=mongoose.model('User',userSchema);