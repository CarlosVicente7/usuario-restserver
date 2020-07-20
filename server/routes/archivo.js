const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const { verificaTokenArchivo } = require('../middlewares/autenticacion');

app.get('/archivo/:tipo/:img', verificaTokenArchivo, function(req, res) {
    let tipo = req.params.tipo;
    let img = req.params.img;

    //PARA LOS USUARIOS DE GOOGLE SE DEBE MANEJAR EN EL FRONT
    //UN PIPE EN ANGULAR SI INICIA CON HTTP

    let pathArchivo = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    if (fs.existsSync(pathArchivo)) {
        res.sendFile(pathArchivo);
    } else {
        //let noImagePath = path.resolve(__dirname, '../assets/archivo.txt');
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});


module.exports = app;