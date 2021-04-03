const fs = require('fs');
// const files = fs.readdirSync('../img');
// console.log(files);
// files.forEach(file => {
//   if (file.endsWith('.png')) {
//     fs.renameSync(file, file.replace(/\s/g, '_'));
//   }
// })


const con = fs.readFileSync('../IIS1.md', 'utf-8');
const ret = con.replace(/\(.\/img\/(.*)\)/g, ($1, $2) => {
  return `(./img/${$2.replace(/\s/g, '_')})`;
});
console.log(ret);

fs.writeFileSync('../IIS1.md',ret);