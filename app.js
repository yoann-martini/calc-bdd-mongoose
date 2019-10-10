const app = require('express')(),
server = require('http').createServer(app),
bodyParser = require('body-parser'),
path = require('path'),
ejs = require('ejs')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/calcbddmongo', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour les commentaires
var operationSchema = new mongoose.Schema({
  chiffre1 : { type : Number, default : null },
  operateur : String,
  chiffre2 : { type : Number, default : null },
  resultat : { type : Number, default :null },
  statut : { type : Boolean, default : false }
});
 
// Création du Model pour les commentaires
var OperationSchemaModel = mongoose.model('operation', operationSchema);
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.get('/', function(req,res){
  var edit = [];
  edit[0] = '';
  edit[1] = '';
 
OperationSchemaModel.find(null, function (err, ops) {
  if (err) { throw err; }
  // comms est un tableau de hash
  res.render('index', { operations : ops, edit:edit }); 
});


});














app.get('/calcul/:id',function(req,res){
  var id=req.params.id;
  OperationSchemaModel.findById(id, async  function (err, result) {
    if (err) { throw err; }
             var chiffre1= Number(result.chiffre1);
             var chiffre2= Number(result.chiffre2);
             var stat=result.statut;
            if(stat==false){ 
                
               var resultat = 0;
             
           

             switch (result.operateur) {
               case '/':
                        resultat = chiffre1 /  chiffre2 ;
                 break;
               case '-':
                        resultat = chiffre1 - chiffre2;
                 break;
               case '+':
                        resultat = chiffre1 + chiffre2 ;
                 break;
               case '*':
                        resultat = chiffre1 * chiffre2 ;
                 break;
               default:
                       resultat = '';

             } 
             
            console.log(stat)
        await OperationSchemaModel.updateOne({_id:id},{ resultat : resultat});
          res.redirect('/');
    

             }else{
                 console.log('verrou');
             }

             /*console.log(resultat);
             console.log(result);*/
            });
           
       
   });
















app.get('/edit/:id', function(req,res){
  var id=req.params.id;

  OperationSchemaModel.find({_id:id}, function (err, ops2) { 
    if (err) { throw err; }

          
    OperationSchemaModel.find(null, function (err, ops) {
      if (err) { throw err; }
  
            /*console.log(resultall);
            console.log(result);*/
            res.render('edit', {calculs: ops, edit: ops2 });
        });
      });

    });




        app.post('/add', function(req, res){
          /*var operation=req.body.name;*/
         /* console.log(req.body.signe.toString());*/

         var monOperation = new OperationSchemaModel({ chiffre1 : req.body.chiffre1,  operateur : req.body.operateur , chiffre2 : req.body.chiffre2 , resultat : null, statut : false });


         monOperation.save(function (err) {
          if (err) { throw err; }
          console.log('Opération ajouté avec succès !');
          // On se déconnecte de MongoDB maintenant
        });
        res.redirect('/');
      });

 

      
      app.post('/update/:id', async function(req, res){
        var id=req.params.id;
        var monOperation = new OperationSchemaModel({ chiffre1 : req.body.chiffre1,  operateur : req.body.operateur , chiffre2 : req.body.chiffre2 , resultat : null, statut : false });

        await OperationSchemaModel.updateOne({_id:id},{ chiffre1 : req.body.chiffre1,  operateur : req.body.operateur , chiffre2 : req.body.chiffre2 , resultat : null, statut : false });
          res.redirect('/');
      });





      
      app.get('/verrou/:id', async function(req,res){
         var id=req.params.id;
        await OperationSchemaModel.updateOne({_id:id},{ statut : true });
          res.redirect('/');
       });


        
       

   





server.listen(8081);