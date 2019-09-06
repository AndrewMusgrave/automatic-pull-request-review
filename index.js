const core = require('@actions/core');
const github = require('@actions/github');

const octokit = new github.GitHub(token);

console.log('i got ran');
console.log(JSON.stringify(github.context));


(async() => {
  await octokit.graphql(`mutation {
    submitPullRequestReview( input: { clientMutationId: "${github.context.payload.base.repo.node_id}", pullRequestReview: "APPROVE"
  }) { clientMutationId } }`)
})()
