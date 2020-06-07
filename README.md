Dropbox
=======

This provides a multipart upload capability to S3 or an S3 compatible service. Tested to work with Minio.

## Prerequisites for Minio
 * A configured Minio instance with a user that *isn't* the root account - see Minio's multi-user [documentation](https://docs.min.io/docs/minio-multi-user-quickstart-guide.html)
 * The Minio Client (mc) configured to connect to that instance.

You need to add the correct S3 permission policy to the user this service will connect with. The included [policy file](putonly.json) assumes a bucket name of `uploads` and will need modification if this is not correct for you.

```bash
# assumes the configured Minio instance is named 'minio'
# replace <USERNAME> with your non-root username

$ mc admin policy add minio putonly putonly.json
$ mc admin policy set minio putonly user=<USERNAME>
```

## Running

Ensure the necessary environment variables are configured.

| Env. variable | Required | Default | Notes |
| ---- | ---- | ---- | ---- |
| S3_KEY | Yes | | The 'username' |
| S3_SECRET | Yes | | The 'password' |
| S3_ENDPOINT | No | Whatever AWS uses by default | The endpoint to connect to, this will be the URI of your Minio instance e.g. `https://storage.example.com` |
| S3_BUCKET | No | 'uploads' | The bucket to upload to - the configured user must have the correct policy permissions |
| S3_REGION | No | 'us-east-1' | The region in which the bucket resides |
| PORT | No | 8080 | The port this service listens on |
| SESSION_SECRET | No | A random value | The session hashing salt value. Randomly chosen unless specified |
| UPPY_SECRET | No | A random value | The Uppy hashing salt value. Randomly chosen unless specified |
| AUTH_USER | No | | A basic auth user |
| AUTH_PASS | No | | The password for the auth user |

```bash
# Will start the service listening on 0.0.0.0:${PORT}

$ npm run start
```

## Running on Dokku

 * Create the application
 * Attach the Dokku repository as a remote
 * Configure configuration settings  
   e.g. `dokku config:set --no-restart S3_ENDPOINT=https://storage.example.com`  
 * Push this repo to the Dokku remote
 
## Important
This application utilises a session that uses secure only cookies. This means you will need to have a functioning SSL setup - with Dokku just use the LetsEncrypt plugin. Simples.