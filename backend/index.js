const express = require('express')
const fs = require('fs');
const AWS = require('aws-sdk');
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const nodeHtmlToImage = require('node-html-to-image')

const port = process.env.PORT || 5000;
const EMAIL_IMAGE_S3_BUCKET_NAME = 'blundr-prod';

const app = express()
let storedText = '';
let latest = '';

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/', async (req, res) => {
    const s3 = new AWS.S3();
    const id = uuidv4();
    const fileName = id + '.png';
    const emailText = req.body.content;
    storedText = emailText;
    latest = id;

    const filePath = `./images/${id}.png`

    nodeHtmlToImage({
        output: filePath,
        html: `
            <html>
                <body>${emailText}</body>
            </html>`
    }).then(() => {
        const fileContent = fs.readFileSync(filePath);

        const params = {
            Bucket: EMAIL_IMAGE_S3_BUCKET_NAME,
            Key: fileName, 
            Body: fileContent,
            ACL: 'public-read'
        };

        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            res.send(data.Location);
        });
    });


});


app.post('/update', async (req, res) => {
    const s3 = new AWS.S3();
    const reqBody = req.body;
    const fileName = reqBody.id + '.png';
    latestText = reqBody.content;
    latest = reqBody.id;

    const filePath = `./updates/${fileName}`;
    nodeHtmlToImage({
        output: filePath,
        html: `<html><body>${latestText}</body></html>`
    }).then(() => {
        const fileContent = fs.readFileSync(filePath);

        var params2 = {
            Bucket: EMAIL_IMAGE_S3_BUCKET_NAME,
            Key: fileName,
          };
        
        s3.deleteObject(params2, function(err, data) {
            const params = {
                Bucket: EMAIL_IMAGE_S3_BUCKET_NAME,
                Key: fileName,
                Body: fileContent,
                ACL: 'public-read'
            };
        
            s3.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
                res.send(data.Location);
            });
          });
    });
})
  
app.get('/latest', (req, res) => {
    const result = JSON.stringify({latestId: latest, latestText: storedText});
    console.log(result)
    res.send(result);
})
  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


