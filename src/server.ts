import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import serverState, { addPeer } from './serverState';
import { PORT, PORT_HEADER_NAME } from './config';

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use('*', (req, res, next) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  next();
})

app.get('/peers', (req, res, next) => {
  const port = req.headers[PORT_HEADER_NAME];
  addPeer(`http://[${req.ip}]:${port}`);
  res.json(serverState.peers);
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  res.status(400);
  res.send({
    data: null,
    error: err.message
  });
}

app.use('*', errorHandler)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
