const express=require('express');
const mongoose=require('mongoose');
const routeUser=require('./routes/routeUser');
const routeSauce=require('./routes/routeSauce');
const helmet=require('helmet');
const  app=express();
const path=require('path');

//connection à la base de connées mongodb avec l'utilisateur projet6Openclassroom
mongoose.connect('mongodb+srv://projet6Open:1234@test.o3won.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
   })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(helmet());
 app.use('/images',express.static(path.join(__dirname, 'images')));
 
 app.use(express.json());
 app.use(express.urlencoded({extended:true}));

 //route utilisateur 
 app.use('/api/auth',routeUser);
 //route des sauces
app.use('/api/sauces',routeSauce);

 module.exports=app;


