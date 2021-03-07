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

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
    res.send("hello");
})

app.get('/c', async (req, res) => {
    const s3 = new AWS.S3();
    const id = uuidv4();
    const fileName = id + '.png';
    const emailText = decodeURIComponent(req.query.content);
    latestText = emailText;
    latest = id;

    nodeHtmlToImage({
        output: `./${id}.png`,
        html: `<html><body>${emailText}</body></html>`
    }).then(() => {
        const fileContent = fs.readFileSync(fileName);

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


app.get('/update', (req, res) => {
    const fileName = req.query.id + '.png';
    latestText = req.query.content;
    latest = req.query.id;

    nodeHtmlToImage({
        output: `./${fileName}`,
        html: `<html><body>${emailText}</body></html>`
    }).then(() => {
        const fileContent = fs.readFileSync(fileName);

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
    res.send(JSON.stringify({latestId: latest, latestText}));
})
  

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


