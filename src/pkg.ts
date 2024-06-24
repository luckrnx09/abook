import * as path from 'path';
const pkg = require(path.resolve(process.cwd(), 'package.json'));

pkg.name = pkg.name.replace('@luckrnx09/', '');
export {pkg};
