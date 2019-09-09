const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("repo-token");

const octokit = new github.GitHub(token);
const event = core.getInput("event");
const body = core.getInput("body") || "";

if ((event === "COMMENT" || event === "REQUEST_CHANGES") && !body) {
  core.error("Needs comment!");
}

(async () => {
  try {
    await octokit.graphql(`
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${github.context.payload["pull_request"]["node_id"]}",
          event: ${event},
          body: "${body}"
        }) {clientMutationId} }`);
  } catch (e) {
    console.error(e);
  }
})()
