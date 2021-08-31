const mongoose=require('mongoose');
const regex=new RegExp(/^[a-zA-Z]+[\s(a-zA-Z)àéèç\',\-!?"\.]+$/g);

const saucesSchema=mongoose.Schema(
{
    userId:{
            type:String,required:true
         },
    name:{type:String,required:true,match:[regex,"caractères non valides"]},

    manufacturer:{type:String,required:true,match:[regex,'manufacturer contient des caractères non autorisés']},
    description:{type:String,required:true,match:[regex,'la description contient des caractères non autorisés']
            },
    mainPepper:{type:String,required:true,match:[regex,'les caractères saisies ne sont autorisés']},
    imageUrl:{type:String,required:true},
    heat:{type:Number,required:true},
    likes:{type:Number,required:true},
    dislikes:{type:Number,required:true},
    usersLiked:[String],
    usersDisliked:[String]
}

);

module.exports=mongoose.model("Sauces",saucesSchema);