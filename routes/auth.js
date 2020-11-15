const {Router} = require('express');
const { check } = require('express-validator');

const { creaUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validarCampos');
const {validarJWT} = require('../middlewares/validarJWT');

const router = Router();

// path:creaUsuario /api/login
router.post('/new',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La password es obligatoria').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos
],creaUsuario);

router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password',' La password es obligatoria').not().isEmpty(),
    validarCampos
], loginUsuario);

router.get('/renew',validarJWT,renewToken);

module.exports = router;