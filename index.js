const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("repo-token");
const event = core.getInput("event");
const body = core.getInput("body");

const octokit = new github.GitHub(token);

if ((event === "COMMENT" || event === "REQUEST_CHANGES") && !body) {
  core.error("Event type COMMENT & REQUEST_CHANGES require a body.");
}

octokit
  .graphql(
    `
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${github.context.payload["pull_request"]["node_id"]}",
          event: ${event},
          body: "${body}"
        }) {clientMutationId} }`
  )
  .catch(err => {
    core.error(err);
    core.setFailed(err.message);
  });
