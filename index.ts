import * as core from '@actions/core';
import * as github from '@actions/github';

const token = core.getInput('repo-token');
const requestEvent = core.getInput('event');
const body = core.getInput('body');

const octokit = new github.GitHub(token);

if (
  (requestEvent === 'COMMENT' || requestEvent === 'REQUEST_CHANGES') &&
  !body
) {
  core.setFailed('Event type COMMENT & REQUEST_CHANGES require a body.');
}

const pullRequest = github.context.payload['pull_request'];

if (!pullRequest) {
  core.setFailed('This action is meant to be ran on pull requests');
}

octokit
  .graphql(
    `
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${(<any>pullRequest)['node_id']}",
          event: ${requestEvent},
          body: "${body}"
        }) {clientMutationId} }`,
  )
  .catch((err) => {
    core.error(err);
    core.setFailed(err.message);
  });
