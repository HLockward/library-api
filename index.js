const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to my API!!'));

bookRoutes(app);
authorRoutes(app);

app.listen(port,() =>
  console.log(`Running on PORT ${port}`)  
);

