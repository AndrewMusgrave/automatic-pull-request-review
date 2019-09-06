const core = require('@actions/core');
const github = require('@actions/github');

core.log('i got ran');
core.log(JSON.stringify(github.context));
