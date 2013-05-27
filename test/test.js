
"use strict"

var should = require('should')
var dualPipeline = require('../lib/dual-pipeline')
var streamConvert = require('quiver-stream-convert')

var transform1 = function(data, callback) {
  var transformedData = '[' + data + ']'
  callback(null, transformedData)
}

var transform2 = function(data, callback) {
  var transformedData = data.toUpperCase()
  callback(null, transformedData)
}

var transformStream1 = streamConvert.createStreamTransformer(
  'transform1', transform1).streamToTransformedStream

var transformStream2 = streamConvert.createStreamTransformer(
  'transform2', transform2).streamToTransformedStream

var streamToText = streamConvert.streamToText

describe('dual pipeline test', function() {
  it('test simple pipeline', function(callback) {
    var testBuffers = [
      'first',
      'second',
      'third'
    ]

    var pipelines = [
      [streamToText, transformStream1],
      [streamToText, transformStream2],
      [streamToText]
    ]

    var readStream = streamConvert.buffersToStream(testBuffers)
    dualPipeline.handleDualPipelineStreams(pipelines, readStream, function(err, results) {
      if(err) throw err

      results.length.should.equal(3)
      results[0].should.equal('firstsecondthird')
      results[1].should.equal('[first][second][third]')
      results[2].should.equal('[FIRST][SECOND][THIRD]')

      callback()
    })
  })
})