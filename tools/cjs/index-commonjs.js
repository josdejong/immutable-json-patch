const immutableJSONPatch = require('./immutableJSONPatch.js').immutableJSONPatch
const revertJSONPatch = require('./immutableJSONPatch.js').revertJSONPatch

immutableJSONPatch.immutableJSONPatch = immutableJSONPatch
immutableJSONPatch.revertJSONPatch = revertJSONPatch

module.exports = immutableJSONPatch
