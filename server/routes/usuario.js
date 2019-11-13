const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();



app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //recogemos solo registros con estado true (activos)
        // Usuario.find({}, 'nombre email role estado google img')
        .skip(desde)
        // .skip(5)
        .limit(limite)
        // .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => { //cuenta solo registros con estado true (activos)
                // Usuario.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
            // res.json({
            //     ok: true,
            //     usuarios
            // });
        })

});

// app.get('/usuario', function(req, res) {
//     res.json('get usuario LOCAL');
// });

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    // if (body.nombre === undefined) {

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }

    // res.json({
    //     persona: body
    // });
    // res.json('Post usuario');
});

// app.put('/usuario/:id', function(req, res) {

//     let id = req.params.id;

//     res.json({
//         ok: true,
//     })


// });
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // let body = req.body;

    // delete body.password;
    // delete body.google;

    // Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //body tiene los datos a actualizar

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});


app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => { //eliminacion de registro por cambio estado = false
        //cambiaEstado tiene los datos a actualizar

        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //eliminacion física del registro

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) { //se intenta borrar usuario ya borrado
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});


// app.delete('/usuario', function(req, res) {
//     res.json('Delete usuario');
// });

module.exports = app;