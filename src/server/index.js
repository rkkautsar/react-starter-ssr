import path from 'path';
import express from 'express';
import compression from 'compression';
import serveReact from './middlewares/serveReact';

const app = express();

const distDir = path.join(__dirname, '..', '..', 'dist');
const publicDir = path.join(__dirname, '..', '..', 'public');

app.set('views', path.join(distDir, 'templates'));
app.set('view engine', 'ejs');

app.use(compression());
app.use('/client', express.static(path.join(distDir, 'client')));
app.use('/assets', express.static(path.join(distDir, 'assets')));
app.use('/static', express.static(publicDir));

app.get('*', serveReact);

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
console.log(`Listening on port ${port} 🎉`);
app.listen(port);
