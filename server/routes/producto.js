const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');


let app = express();

let Producto = require('../models/producto');
const bodyParser = require('body-parser');

//======================================================
// Obtener Productos
//======================================================
app.get('./productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;

    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'usuario email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                productos
            });

        });
});

//=======================================================================
//Obtener produtco por Id
//=======================================================================
app.get('./productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID  no existe'
                    }
                });

            }
            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

//==========================================================================
//Para buscar un producto
//==========================================================================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new Regexp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria ', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            res.json({
                ok: true,
                productos
            })
        })
})





//==========================================================================
//Para crear un nuevo producto
//==========================================================================
app.post('./productos', verificarToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario_.id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,


    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});


//==========================================================================
//Para modificar producto
//==========================================================================
app.put('./producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        producto.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })





    });
});


//==========================================================================
//Para eliminar un producto
//==========================================================================
app.delete('./producto/:id', verificarToken, (req, res) => {


    let id = req.params.id;

    Producto.findById(id, verificarToken, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });

        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
        })

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'producto "eliminado" '
        })
    })
})



module.exports = app;