const express = require('express')
const path = require('path');
const port = process.env.PORT || 5000
var fs = require('fs');
var text2png = require('text2png');
const AWS = require('aws-sdk');


const app = express()
const s3 = new AWS.S3();

app.get('/', (req, res) => {
  
  
  const { v4: uuidv4 } = require('uuid');
  const fileName = uuidv4() + '.png';

  fs.writeFileSync(fileName, text2png('Hello!', {color: 'blue'}));
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
