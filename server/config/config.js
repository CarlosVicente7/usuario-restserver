//=============
//PUERTO
//==========
process.env.PORT = process.env.PORT || 3000;


//=============
//ENTORNO
//=============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
//VENCIMIENTO TOKEN
//=============
process.env.CADUCIDAD_TOKEN = '48h' //60 * 60 * 24 * 30;

//=============
//SEED LOGIN
//=============
process.env.SEED = process.env.SEED || 'secret_SEED_desarrollo';

//=============
//BD
//============= 
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}
process.env.URLBD = urlBD;

//================
//GOOGLE CLIENT ID
//================

process.env.CLIENT_ID = process.env.CLIENT_ID || '957537587314-7lg52kjoq25acgq98tktmknsmbh6djjq.apps.googleusercontent.com';