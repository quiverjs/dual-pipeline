
"use strict"

var async = require('async')
var error = require('quiver-error').error
var splitStream = require('quiver-split-stream').splitStream

var handleDualPipelineStreams = function(pipelines, inputStream, callback) {
  var currentPipeline = pipelines[0]
  var toSerializedObject = currentPipeline[0]

  if(pipelines.length == 1) return toSerializedObject(inputStream, callback)

  var toIntermediaryStream = currentPipeline[1]
  var splitStreams = splitStream(inputStream)

  async.parallel({
    serializedIntermediaries: function(callback) {
      toIntermediaryStream(splitStreams[0], function(err, resultStream) {
        if(err) return callback(err)

        handleDualPipelineStreams(pipelines.slice(1), resultStream, callback)
      })
    }, currentSerialized: function(callback) {
      toSerializedObject(splitStreams[1], callback)
    }
  }, function(err, result) {
    if(err) err = error(500, 'error processing stream')

    var serializedIntermediaries = result.serializedIntermediaries
    var currentSerialized = result.currentSerialized

    var joinedResult = [currentSerialized].concat(serializedIntermediaries)

    callback(err, joinedResult)
  })
}

module.exports = {
  handleDualPipelineStreams: handleDualPipelineStreams
}