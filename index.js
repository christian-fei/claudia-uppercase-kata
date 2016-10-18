var convert = require('./convert')

exports.handler = function (event, context) {
  var eventRecord = event.Records && event.Records[0];

  if (eventRecord) {
    if (eventRecord.eventSource === 'aws:s3' && eventRecord.s3) {
      convert(
        eventRecord.s3.bucket.name,
        eventRecord.s3.object.key
      )
      .then(context.succeed)
      .catch(context.fail)
    } else {
      context.fail('unsupported event source');
    }
  } else {
    context.fail('no records in the event');
  }
};
