var Minio = require('minio')

var client = new Minio.Client({
    endPoint: 'storage.networkpie.co.uk',
    accessKey: 'upload_user',
    secretKey: 'SuperSecurePassw0rd'
});

// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://docs.min.io/docs/javascript-client-api-reference#presignedPutObject) 
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require('express')()

server.get('/presignedUrl', (req, res) => {
    client.presignedPutObject('uploads', req.query.name, (err, url) => {
        if (err) throw err
        res.end(url)
    })
})

server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8080)
