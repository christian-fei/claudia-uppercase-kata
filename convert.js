var aws = require('aws-sdk');

module.exports = function convert(bucket, fileKey, context) {
  var s3 = new aws.S3({ signatureVersion: 'v4' }),
      Transform = require('stream').Transform,
      uppercase = new Transform({decodeStrings: false}),
      stream;
  uppercase._transform = function (chunk, encoding, done) {
    done(null, chunk.toUpperCase());
  };
  stream = s3.getObject({
    Bucket: bucket,
    Key: fileKey
  }).createReadStream();
  stream.setEncoding('utf8');
  stream.pipe(uppercase);
  s3.upload({
    Bucket: bucket,
    Key: fileKey.replace(/^in/, 'out'),
    Body: uppercase,
    ACL: 'private'
  }, context.done);
}
