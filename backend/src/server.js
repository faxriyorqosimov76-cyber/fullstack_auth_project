import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

import app from './app.js';



app.listen(4000, '0.0.0.0', () => console.log("backend 4000 portda ishlayapti"))