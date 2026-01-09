const express  = require('express');
const app = express();
const cors = require('cors');

const participantesRoutes = require('./views/participantesRoutes');

app.use(express.json());
app.use(cors())

app.use('/participantes',participantesRoutes);

app.listen(6500,()=> {
    console.log('Servidor Activo');
})