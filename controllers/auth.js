const{response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const creaUsuario = async(req, res = response) =>{
    const {email,password} = req.body;

    try {
        const existeEmail = await Usuario.findOne({email:email});
        if(existeEmail){
            return res.status(404).json({
                ok: false,
                msg:'El correo ya esta registrado'
            });
        }
        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password =  bcrypt.hashSync(password,salt);
        await usuario.save();

        // Generar mi JWT Json web token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Falla en el servidor'
        });
    }

}

const loginUsuario = async(req, res = response)=>{
    const {email,password} = req.body;
    try {
        const usuarioDB = await Usuario.findOne({email:email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg:'Email no encontrado'
            });
        }
        // validar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword){
            return res.status(404).json({
                ok: false,
                msg:'Password no valida'
            });
        }
        //Generar el JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Falla en el servidor'
        });
    }
}

const renewToken = async(req, res = response)=>{

    //
    const uid = req.uid;
    // generar
    const token = await generarJWT(uid);
    //
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    creaUsuario,
    loginUsuario,
    renewToken
}