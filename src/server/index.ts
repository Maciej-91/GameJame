import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';

require('dotenv').config(path.resolve(__dirname, '.env'));

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 8000;

require('./config/db.config')

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './public')));
app.get(/^((?!(\/api)).)*$/, (req, res) => res.sendFile(path.resolve(__dirname, './public/index.html')));
// app.use('/api/', require('./routes/router'));
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));