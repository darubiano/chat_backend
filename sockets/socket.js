const { usuarioConectado, usuarioDesconectado,grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    //console.log(client.handshake.headers['x-token']);
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    console.log(valido, uid);
    // verificar autenticacion
    if (!valido) {
        return client.disconnect();
    }
    // cliente autenticado
    console.log('Cliente autenticado');
    usuarioConectado(uid);

    //Ingresar al usuario a una sala en particular
    // sala global, client.id, 5fb05ae94a68f31f7831c0d5
    client.join(uid);

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal',async(payload)=>{
        //console.log(payload);
        // Grabar mensaje
        await grabarMensaje(payload);
        // Reflejar respuesta
        io.to(payload.para).emit('mensaje-personal',payload);
    });

    //client.to(uid).emit('');

    client.on('disconnect', () => {
        //console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    /*client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });*/


});
