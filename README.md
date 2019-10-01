# Automatic Pull Request Review

> 👍 Github action to automate pull requests

This action allows you to use any of the `pull_request` [webhook event](https://help.github.com/en/articles/events-that-trigger-workflows#webhook-events) to automate pull request reviews. For example when a `pull request` is `opened` by `dependabot`, automatically approve it.

## Usage

1. Create a new workflow by adding `.github/workflows/pull-request-automation.yml` to your project.
2. In the `pull-request-automation.yml` you have to decide which events you'll act on and the actors pull requests to automate.

_For example:_

To approve all pull requests pull requests from `dependabot`, you would add the following to the `yml` file:

```yml
name: Automatic pull request review
on: [pull_request]
jobs:
  automate-pullrequest-review:
    runs-on: ubuntu-latest
    steps:
      - name: Approve pull request
        if: github.actor == 'dependabot[bot]'
        uses: andrewmusgrave/automatic-pull-request-review@0.0.2
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'
          event: APPROVE
          body: 'Thank you dependabot 🎊'
```

## Workflow options

These are the options recommended to be changed. For more detailed explanation of the workflow file, check out the [GitHub documentation](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

| Setting      | Description                                                                                | Values                                           |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `event`      | The event to perform on the pull request review.                                           | APPROVE \| COMMENT \| DISMISS \| REQUEST_CHANGES |
| `body`       | The contents of the review body comment. Required when event is COMMENT or REQUEST_CHANGES | String                                           |
| `repo-token` | The personal access token                                                                  | `${{ secrets.GITHUB_TOKEN }}`                    |
