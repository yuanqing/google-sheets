function extractColumnRange (range) {
  const matches = range.match(/!([A-Z]+)\d+:([A-Z]+)\d+/)
  return {
    start: matches[1],
    end: matches[2]
  }
}

module.exports = extractColumnRange
