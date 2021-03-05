const express = require('express')
const fs = require('fs');
const text2png = require('text2png');
const AWS = require('aws-sdk');
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const port = process.env.PORT || 5000;

const app = express()
const s3 = new AWS.S3();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

var latest = '';
var latestText = '';

app.get('/', (req, res) => {
  
  const id = uuidv4();
  const fileName = id + '.png';
  const emailText = decodeURIComponent(req.query.content);
  latestText = emailText;
  latest = id;

  fs.writeFileSync(fileName, text2png(emailText, {color: 'black', font: '13px Sans Serif'}));
  const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'technica-brand-assets',
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        res.send(data.Location);
    });
    
})

app.get('/update', (req, res) => {
  const fileName = req.query.id + '.png';

  fs.writeFileSync(fileName, text2png(decodeURIComponent(req.query.content), {color: 'black', font: '13px Sans Serif'}));
  const fileContent = fs.readFileSync(fileName);

  latestText = req.query.content;
  latest = req.query.id;

  var params2 = {
    Bucket: 'technica-brand-assets',
    Key: fileName, // File name you want to save as in S3
  };
  
  s3.deleteObject(params2, function(err, data) {
          // Setting up S3 upload parameters
    const params = {
      Bucket: 'technica-brand-assets',
      Key: fileName, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
  };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        res.send(data.Location);
    });
  });


    
})

app.get('/latest', (req, res) => {
  res.send(JSON.stringify({latestId: latest, latestText}));
})

app.get('/updateEmail', (req, res) => {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
      res.send(text);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
