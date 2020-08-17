const express = require('express');

let { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const categoria = require('../models/categoria');


//===========================================
// Mostrar todas las categorias
//============================================
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.json({
                ok: true,
                categorias
            });
        });

});




//===========================================
// Mostrar categorias por ID
//============================================
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es valido'
                }
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});




//===========================================
// Crear una nueva categoria
//============================================
app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});





//===========================================
// Mostrar todas las categorias
//============================================
app.put('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});





//===========================================
// Borrar categoria por ID
//============================================

app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });

        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
});




module.exports = app;