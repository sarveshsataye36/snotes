const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const app = express()
const port = 5000
 // using express module for insering json 
app.use(express.json());

// making routers end points for inserting the data
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})