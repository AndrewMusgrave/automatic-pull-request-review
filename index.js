const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("repo-token");

const octokit = new github.GitHub(token);

console.log(github.context.payload["pull_request"]["node_id"]);

(async () => {
  try {
    await octokit.graphql(`
      mutation {
        addPullRequestReview(input: {
          pullRequestId: "${github.context.payload["pull_request"]["node_id"]}",
          event: APPROVE
        }) {clientMutationId} }`);
  } catch (e) {
    console.error(e);
  }
})();

// (async () => {
//   try {
//     await octokit.graphql(`
//       mutation {
//         submitPullRequestReview(input: {
//           pullRequestReviewId: "${
//             github.context.payload["pull_request"]["node_id"]
//           }",
//           event: APPROVE
//         }) {clientMutationId} }`);
//   } catch (e) {
//     console.error(e);
//   }
// })();
  
