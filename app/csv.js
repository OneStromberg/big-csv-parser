const csv = require('csv');
const fs = require('fs');

function createCSVStreamPipe(fileName, startLine, endLine) {
  const readStream = fs.createReadStream(fileName);
  const parse = csv.parse();
  const readStreamPipe = readStream.pipe(parse);
  // Parse CSV from startLine
  readStreamPipe.options.from = startLine;
  // Parse CSV to endLine if defined or to till the end of the file
  readStreamPipe.options.to = endLine || readStreamPipe.info.lines;
  return readStreamPipe;
}

function csvReadStream(fileName, startLine, endLine, onData, onEnd, onError) {
  const readStreamPipe = createCSVStreamPipe(fileName, startLine, endLine);
  let index = startLine;
  readStreamPipe.on('error', onError);
  readStreamPipe.on('end', onEnd);
  readStreamPipe.on('data', (row) => {
    readStreamPipe.pause();
    row.unshift([index]);
    onData(row);
    index += 1;
    readStreamPipe.resume();
  });
}

module.exports = {
  csvReadStream,
};
