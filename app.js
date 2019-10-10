const app = require('express')(),
server = require('http').createServer(app),
bodyParser = require('body-parser'),
path = require('path'),
ejs = require('ejs')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req,res){
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/calcbddmongo";
  
  MongoClient.connect(url, function(err, calcbddmongo) {
    if (err) throw err;
    console.log("Database created!");
    const data = calcbddmongo.collection("operation").find();
    console.log(data);
    res.render('index',{calculs:data});
  });
  

           

});



server.listen(8081);