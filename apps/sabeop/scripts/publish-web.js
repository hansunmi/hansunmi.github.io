// expo export 결과(dist)를 GitHub Pages 경로(/sabeop)로 복사한다.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist');
const dest = path.join(__dirname, '..', '..', '..', 'sabeop');

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`published → ${path.relative(process.cwd(), dest)}`);
