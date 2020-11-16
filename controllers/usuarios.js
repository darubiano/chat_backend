const{ response} = require('express');
const Usuario = require('../models/Usuario');

const getUsuarios = async(req, res= response)=>{

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario
        .find({_id: {$ne: req.uid}})
        .sort('-online')
        .skip(desde)
        .limit(20);

    res.json({
        ok: true,
        usuario: usuarios,
        desde:desde
    });
}

module.exports= {
    getUsuarios
}