function extractColumnRange (range) {
  return range.match(/!(\S+)/)[1]
}

module.exports = extractColumnRange
