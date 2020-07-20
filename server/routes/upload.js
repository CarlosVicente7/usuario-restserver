const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs = require('fs');
const path = require('path');
// default options
//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    //Validar tipo

    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipos permitidos son : ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    //input debe llamarse archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //extensiones permitidas
    let extensionesValidas = ['png', 'pdf', 'jpg', 'jpeg', 'doc', 'xls'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Extensiones permitidas son : ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        // res.json({
        //     ok: true,
        //     message: 'Archivo subido correctamente'
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    //aqui imagen ya se cargo al filesystem
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    //aqui imagen ya se cargo al filesystem
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarImagen(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borrarImagen(nombreArchivo, tipo) {
    let pathArchivo = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
    if (fs.existsSync(pathArchivo)) {
        fs.unlinkSync(pathArchivo);
    }
}

module.exports = app;