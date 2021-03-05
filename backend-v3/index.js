const express = require('express')
const fs = require('fs');
const AWS = require('aws-sdk');
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const nodeHtmlToImage = require('node-html-to-image')


const port = process.env.PORT || 5000;

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', async (req, res) => {
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

        // Setting up S3 upload parameters
        const params = {
            Bucket: 'blundr-prod',
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


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


