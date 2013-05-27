
quiver-dual-pipeline
====================

Chain a stream to two pipelines that do two different purposes. The first pipeline accepts a stream and serialize it into a Javascript Object. The second pipeline accepts a stream and create a result stream, which is then feed in to the next chain of the pipeline which the stream is processed the same way. At the end of the pipeline all the serialization of the intermediary result streams are collected in one place and returned to the callback.

This is useful for a common pattern where a stream undergoes several stages of stream transformation, while needing to process each intermediary transformed streams in parallel of the stream processing.