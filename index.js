var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var companion = require('@uppy/companion')

var app = express()
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: "/",
        httpOnly: true,
        secure: true
    }
}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept'
    )

    res.setHeader('Access-Control-Allow-Credentials', 'true')

    next()
})

const options = {
    providerOptions: {
        s3: {
            getKey: (req, filename, metadata) => filename,
            key: process.env.MINIO_KEY,
            secret: process.env.MINIO_SECRET,
            bucket: process.env.BUCKET,
            acl: 'private',
            awsClientOptions: {
                endpoint: process.env.MINIO_HOST,
                s3ForcePathStyle: true
            }
        }
    },
    server: {
        host: 'localhost:8080',
        protocol: 'http'
    },
    filePath: '/tmp',
    secret: process.env.MINIO_HASH_SECRET,
    debug: true
}
  
app.use(companion.app(options))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// handle server errors
app.use((err, req, res, next) => {
    console.error('\x1b[31m', err.stack, '\x1b[0m')
    res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(8080), options)
