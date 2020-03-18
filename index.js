const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const companion = require('@uppy/companion')
const str = require('@supercharge/strings')

if (typeof process.env.S3_KEY == 'undefined' 
        || typeof process.env.S3_SECRET == 'undefined') {

    console.log('ERROR environment variables S3_KEY, S3_SECRET are required.')
    process.exit(1)        
}

const port = process.env.PORT || 8080
const options = {
    providerOptions: {
        s3: {
            getKey: (req, filename, metadata) => filename,
            key: process.env.S3_KEY,
            secret: process.env.S3_SECRET || 'uploads',
            bucket: process.env.S3_BUCKET,
            acl: 'private',
            awsClientOptions: {
                s3ForcePathStyle: true
            }
        }
    },
    server: {
        host: `localhost:${port}`,
        protocol: 'http'
    },
    filePath: '/tmp',
    secret: process.env.UPPY_SECRET || str.random(32),
    debug: true
}

Object.assign(options.providerOptions.s3.awsClientOptions, process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT })

let app = express()
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET || str.random(32),
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
  
app.use(companion.app(options))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// handle server errors
app.use((err, req, res, next) => {
    console.error('\x1b[31m', err.stack, '\x1b[0m')
    res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(port), options)

console.log(`Server running on port ${port}`)