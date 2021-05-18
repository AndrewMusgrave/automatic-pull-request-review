import * as core from '@actions/core';
import * as github from '@actions/github';

/** Returns true if any review in the reviews array has author's login
'github-actions' and the same body */
function isAnyDuplicatedReview(reviews: Array<any>): boolean {
  for (let review of reviews) {
    if(review.author.login === 'github-actions' && review.body === body){
      core.info('Duplicated review');
      return true;
    }
  }
  core.info('No duplicated review');
  return false;
}

/** Gets the PR reviews by querying the GitHub API (GraphQL) and calls
isAnyDuplicatedReview to know if any of them is a duplicate */
async function existsDuplicatedReview(): Promise<boolean | undefined > {
  const repo = <any>pullRequest.base.repo;
  const query = `
    query {
    repository(owner: "${repo.owner.login}", name: "${repo.name}") {
      pullRequest(number: ${pullRequest.number}) {
        reviews(last: 100, states: ${reviewState}) {
          nodes {
            author {
              login
            }
            body
          }
        }
      }
    }
  }`;

  try {
    const { repository } = await octokit.graphql(query, {});
    const reviews = <Array<any>>repository.pullRequest.reviews.nodes;
    return isAnyDuplicatedReview(reviews);
  }
  catch (err) {
    core.error(`${err} ${query}`);
    core.setFailed(err.message);
  }
}

/** Send the review if there is not a duplicate or if duplicates are allowes */
async function sendReview(): Promise<void> {
  if(allow_duplicate || !(await existsDuplicatedReview())) {
    const query = `
      mutation {
        addPullRequestReview(input: {
        pullRequestId: "${pullRequest.node_id}",
        event: ${requestEvent},
        body: "${body}"
      }) {clientMutationId}
    }`;
    octokit.graphql(query).catch((err: Error) => {
      core.error(`${err} ${query}`);
      core.setFailed(err.message);
    });
  }
}

const token = core.getInput('repo-token');
const octokit = github.getOctokit(token);
const requestEvent = core.getInput('event');
const body = core.getInput('body');
const allow_duplicate = core.getInput('allow_duplicate').toUpperCase() === 'TRUE';
const pullRequestReviewState : Record<string, string> = {
  APPROVE: 'APPROVED',
  COMMENT: 'COMMENTED',
  DISMISS: 'DISMISSED',
  REQUEST_CHANGES: 'CHANGES_REQUESTED'
}
const reviewState = pullRequestReviewState[requestEvent];

if(!reviewState){
  core.setFailed('Invalid event type, allowed values: APPROVE, COMMENT, DISMISS, REQUEST_CHANGES')
}

if (
  (requestEvent === 'COMMENT' || requestEvent === 'REQUEST_CHANGES') &&
  !body
) {
  core.setFailed('Event type COMMENT & REQUEST_CHANGES require a body.');
}

const pullRequest = <any>github.context.payload['pull_request'];

if (!pullRequest) {
  core.setFailed('This action is meant to be ran on pull requests');
}

sendReview();
