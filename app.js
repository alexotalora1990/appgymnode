
import express from 'express';
import 'dotenv/config';
import dbConexion from './database/cnxmongoose.js';
import cron from 'node-cron';
import cors from 'cors';

import clientes from './routes/clientes.js';
import ingresos from './routes/ingresos.js';
import mantenimientos from './routes/mantenimiento.js';
import maquinas from './routes/maquinas.js';
import pagos from './routes/pagos.js';
import planes from './routes/planes.js';
import productos from './routes/productos.js';
import sedes from './routes/sedes.js';
import ventas from './routes/ventas.js';
import usuarios from './routes/usuarios.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/clientes', clientes);
app.use('/api/ingresos', ingresos);
app.use('/api/mantenimientos', mantenimientos);
app.use('/api/maquinas', maquinas);
app.use('/api/pagos', pagos);
app.use('/api/planes', planes);
app.use('/api/productos', productos);
app.use('/api/sedes', sedes);
app.use('/api/ventas', ventas);
app.use('/api/usuarios', usuarios);

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
  dbConexion();
});
