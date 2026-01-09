const express = require('express');
const router = express.Router();
const participantesController = require('../controllers/participantesController.js')

router.get('/',participantesController.consultar);

router.post('/',participantesController.ingresar);
router.post('/validar-codigo', participantesController.validarCodigo);
router.get('/verificar/:numero', participantesController.verificarNumero);
router.route('/:id')
    .get(participantesController.consultar)
    .put(participantesController.actualizar)
    .delete(participantesController.borrar);

module.exports = router;