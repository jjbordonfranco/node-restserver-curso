/////////////////////////////
//////////  PUERTO
////////////////////////////

process.env.PORT = process.env.PORT || 3000;

//
// Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //variable Heroku. Si no existe supondré  que estoy en desarrollo

//
// Base de datos
//

let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe'; //acceso BBDD local
// } else {
urlDB = process.env.MONGO_URI; // sustituimos cadena url por la variable de entorno creada, que tiene asignada como valor la cadena
// urlDB = 'mongodb+srv://alguien:entr@rMongoDB@cluster0-aibc0.mongodb.net/cafe'; //acceso BBDD MongoAtlas
// }

process.env.URLDB = urlDB;