const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidados = { values: ['ADMIN_ROLE', 'USER_ROLE'], message: '{VALUE} no es un role válido' };

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'nombre necesario']
    },
    email: {
        type: String,
        required: [true, ' email necesario'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidados
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);