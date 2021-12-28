import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import serverState from './serverState';

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

const port = process.env.PORT || (process.argv.includes('--peer') ? Math.floor(Math.random() * 500 + 8000) : 9000);

app.listen(port, () => console.log(`Listening on port ${port}`));
