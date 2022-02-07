import * as core from '@actions/core';
import * as github from '@actions/github';

const token = core.getInput('repo-token') || "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";
const requestEvent = core.getInput('event');
const body = core.getInput('body');

const octokit = github.getOctokit(token);

if ((requestEvent === 'COMMENT' || requestEvent === 'REQUEST_CHANGES') && !body) {
  core.setFailed('Event type COMMENT & REQUEST_CHANGES require a body.');
}

const pullRequest = github.context.payload['pull_request'];

if (!pullRequest) {
  core.setFailed('This action is meant to be ran on pull requests');
}

if (!pullRequest?.number) {
  core.setFailed("Pull request number is unavailable");
} else {
  const pattern = /aws-java-sdk-s3 from (\d+)\.(\d+)\.\d+ to \1\.\2\.\d+/;
  octokit.pulls.get({ owner: "patientsknowbest", repo: "phr", pull_number: pullRequest?.number })
    .then(pull => {
      if (pull.data.user?.login === "dependabot[bot]" && pattern.test(pull.data.title)) {
        const query = `
        mutation {
          addPullRequestReview(input: {
            pullRequestId: "${(<any>pullRequest)['node_id']}",
            event: ${requestEvent},
            body: "${body}"
          }) {clientMutationId}
        }`;

        octokit.graphql(query).catch((err) => {
          core.error(err);
          core.setFailed(err.message);
        });
      }
    })
}
