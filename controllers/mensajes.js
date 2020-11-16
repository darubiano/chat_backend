const Mensaje = require('../models/Mensaje');


const obtenerChat = async (req, res) =>{
    const miId = req.uid;
    const mensajeDe = req.params.de;
    //console.log(mensajeDe);
    const last30 = await Mensaje.find({
        $or:[{de:mensajeDe, para:miId},{de:miId, para:mensajeDe}]//de:mensajeDe
    }).sort({createdAt:'desc'}).limit(30);
    //console.log(last30);
    res.json({
        ok:true,
        mensajes:last30
    });
}
module.exports = {
    obtenerChat
}