const { MongoClient } = require('mongodb');

let db;
MongoClient.connect('mongodb://localhost/tracksdb', {
    useUnifiedTopology: true
},(err,client)=>{
    if(err){
        console.log(err);
        process.exit(0);
    }
    db = client.db('tracksdb');
    console.log("Base de datos conectada");
});

const getConnection = () =>db;

module.exports={
    getConnection
}