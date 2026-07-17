// Fetches a GitHub user's real contribution calendar via GitHub's GraphQL API.
//
// REQUIRES a GITHUB_TOKEN in your backend's .env file. GitHub's GraphQL API
// requires authentication for every request, even for public data — the
// token doesn't need any special scopes, it just needs to exist. Create one
// at https://github.com/settings/tokens (classic token, no scopes needed
// for public contribution data) and add to .env:
//   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
//
// Uses Node's built-in fetch (available in Node 18+) — no extra dependency.

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const QUERY = `
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

async function getContributionCalendar(username) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not set in .env — required to query GitHub's GraphQL API."
    );
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with status ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    // e.g. username doesn't exist
    throw new Error(json.errors[0]?.message || "GitHub API returned an error");
  }

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error("No contribution data found for this username");
  }

  return calendar; // { totalContributions, weeks: [{ contributionDays: [...] }] }
}

module.exports = { getContributionCalendar };