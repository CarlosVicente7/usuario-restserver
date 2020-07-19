const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

//
//MOSTRAR TODOS LAS PRODUCTOS
//
app.get('/producto', verificaToken, (req, res) => {
    //tomando parametros de la ruta producto?desde=ss&limte=sfdsdf
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Producto.find({}) //, 'nombre email role estado google img'
        .sort('nombre')
        .populate('categoria', 'descripcion') //segundo parametro opcional
        .populate('usuario', 'nombre email') //segundo parametro opcional
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });
});

//SELECCIONAR UN PRODUCTO
//
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion') //segundo parametro opcional
        .populate('usuario', 'nombre email') //segundo parametro opcional
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto' //aqui entra cuando el id no coincide en longitud
                    }
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto.' //aqui entra cuando el id no existe
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//CREAR NUEVO PRODUCTO
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//ACTUALIZAR PRODUCTO
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    //=============================================================
    //EN EL VIDEO (147) ACTUALIZO PRIMERO BUSCANDO Y LUEGO CON SAVE
    //=============================================================
    let dataProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, dataProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//BORRAR PRODUCTO
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let dataProducto = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, dataProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El producto no existe' }
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El producto no existe.' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//BUSQUEDA PRODUCTO
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    let regex = new RegExp(termino, 'i'); //la i:permite busqueda insensible a las mayusculas

    //nombre: termino --busqueda exacta
    Producto.find({ nombre: regex }) //, 'nombre email role estado google img'
        .sort('nombre')
        .populate('categoria', 'descripcion') //segundo parametro opcional
        .populate('usuario', 'nombre email') //segundo parametro opcional
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ nombre: regex }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });
});
module.exports = app;