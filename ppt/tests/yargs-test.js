const yargs = require('yargs/yargs');
const argv = yargs(process.argv.slice(2))
  .option('quanlity', {
    alias: 'q',
    describe: '图片压缩的百分比',
    type: 'number',
  })
  .argv;

const quanlity = argv.quanlity;

console.log("要压缩的质量为：", quanlity);