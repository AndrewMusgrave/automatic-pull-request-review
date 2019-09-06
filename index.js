const core = require('@actions/core');
const github = require('@actions/github');

console.log('i got ran');
console.log(JSON.stringify(github.context));
