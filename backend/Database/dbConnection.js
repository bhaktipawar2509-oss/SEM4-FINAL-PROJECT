
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/mydatabase'



function ConnectDB() {
    mongoose.connect(mongoURL)
.then(function(){
    console.log("Connected to MongoDB successfully!")
})
.catch(function(err){
    console.log("Error connecting to MongoDB:", err);
});


}



module.exports = ConnectDB