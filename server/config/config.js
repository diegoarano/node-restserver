////////////  PUERTO ////////////////

process.env.PORT = process.env.PORT || 3000;


//////////ENTORNO////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



////////////////VENCIMIENTO DEL TOKEN///////////
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';



///////////SEED DE AUTENTICACION (SECRETS)////////////////////////
process.env.SEED = process.env.SEED || 'secrets';


//////////BASE DE DATOS////////////

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
};

process.env.URLDB = urlDB;


/////////////////GOOGLE CLIENT ID ///////////////

process.env.CLIENT_ID = process.env.CLIENT_ID || '48809623375-k73sppoerftbjnesdgnu4gk2lo68b1it.apps.googleusercontent.com';