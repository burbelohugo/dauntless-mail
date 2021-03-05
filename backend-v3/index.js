const express = require('express')

const port = process.env.PORT || 5000;

const app = express()

var latest = '';
var latestText = '';

app.get('/', (req, res) => {
    res.send('Hello from App Engine!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


