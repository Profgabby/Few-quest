const fs=require('node:fs'),assert=require('node:assert/strict');
const s=fs.readFileSync('components/storyverse/story-reader.tsx','utf8');
assert.match(s,/function answer\(i:number\)\{if\(selected!==null\)return;/);
assert.match(s,/disabled=\{selected!==null\}/);
assert.match(s,/Only your first answer counts/);
console.log('PASS first-answer guard and disabled choices present (static source assertion)');
