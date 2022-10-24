const crypto = require('crypto');

function generateWebhookPayload(type) {
   switch (type) {

      case 'tag': 
      case 'new_tag':
         return {
            "headers": {
               "host": "c5ae-41-174-182-30.eu.ngrok.io",
               "user-agent": "GitHub-Hookshot/ede37db",
               "content-length": "6273",
               "accept": "*/*",
               "content-type": "application/json",
               "x-forwarded-for": "140.82.115.154",
               "x-forwarded-proto": "https",
               "x-github-delivery": "b2e2d2b0-520f-11ed-8413-b9f137d550a4",
               "x-github-event": "create",
               "x-github-hook-id": "385069305",
               "x-github-hook-installation-target-id": "88584519",
               "x-github-hook-installation-target-type": "organization",
               "accept-encoding": "gzip"
            },
            "body": {
               "ref": "v0.1.0",
               "ref_type": "tag",
               "master_branch": "main",
               "description": null,
               "pusher_type": "user",
               "repository": {
                  "id": 555850672,
                  "node_id": "R_kgDOISGbsA",
                  "name": "temp",
                  "full_name": "Xavisoft/temp",
                  "private": true,
                  "owner": {
                     "login": "Xavisoft",
                     "id": 88584519,
                     "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4NTg0NTE5",
                     "avatar_url": "https://avatars.githubusercontent.com/u/88584519?v=4",
                     "gravatar_id": "",
                     "url": "https://api.github.com/users/Xavisoft",
                     "html_url": "https://github.com/Xavisoft",
                     "followers_url": "https://api.github.com/users/Xavisoft/followers",
                     "following_url": "https://api.github.com/users/Xavisoft/following{/other_user}",
                     "gists_url": "https://api.github.com/users/Xavisoft/gists{/gist_id}",
                     "starred_url": "https://api.github.com/users/Xavisoft/starred{/owner}{/repo}",
                     "subscriptions_url": "https://api.github.com/users/Xavisoft/subscriptions",
                     "organizations_url": "https://api.github.com/users/Xavisoft/orgs",
                     "repos_url": "https://api.github.com/users/Xavisoft/repos",
                     "events_url": "https://api.github.com/users/Xavisoft/events{/privacy}",
                     "received_events_url": "https://api.github.com/users/Xavisoft/received_events",
                     "type": "Organization",
                     "site_admin": false
                  },
                  "html_url": "https://github.com/Xavisoft/temp",
                  "description": null,
                  "fork": false,
                  "url": "https://api.github.com/repos/Xavisoft/temp",
                  "forks_url": "https://api.github.com/repos/Xavisoft/temp/forks",
                  "keys_url": "https://api.github.com/repos/Xavisoft/temp/keys{/key_id}",
                  "collaborators_url": "https://api.github.com/repos/Xavisoft/temp/collaborators{/collaborator}",
                  "teams_url": "https://api.github.com/repos/Xavisoft/temp/teams",
                  "hooks_url": "https://api.github.com/repos/Xavisoft/temp/hooks",
                  "issue_events_url": "https://api.github.com/repos/Xavisoft/temp/issues/events{/number}",
                  "events_url": "https://api.github.com/repos/Xavisoft/temp/events",
                  "assignees_url": "https://api.github.com/repos/Xavisoft/temp/assignees{/user}",
                  "branches_url": "https://api.github.com/repos/Xavisoft/temp/branches{/branch}",
                  "tags_url": "https://api.github.com/repos/Xavisoft/temp/tags",
                  "blobs_url": "https://api.github.com/repos/Xavisoft/temp/git/blobs{/sha}",
                  "git_tags_url": "https://api.github.com/repos/Xavisoft/temp/git/tags{/sha}",
                  "git_refs_url": "https://api.github.com/repos/Xavisoft/temp/git/refs{/sha}",
                  "trees_url": "https://api.github.com/repos/Xavisoft/temp/git/trees{/sha}",
                  "statuses_url": "https://api.github.com/repos/Xavisoft/temp/statuses/{sha}",
                  "languages_url": "https://api.github.com/repos/Xavisoft/temp/languages",
                  "stargazers_url": "https://api.github.com/repos/Xavisoft/temp/stargazers",
                  "contributors_url": "https://api.github.com/repos/Xavisoft/temp/contributors",
                  "subscribers_url": "https://api.github.com/repos/Xavisoft/temp/subscribers",
                  "subscription_url": "https://api.github.com/repos/Xavisoft/temp/subscription",
                  "commits_url": "https://api.github.com/repos/Xavisoft/temp/commits{/sha}",
                  "git_commits_url": "https://api.github.com/repos/Xavisoft/temp/git/commits{/sha}",
                  "comments_url": "https://api.github.com/repos/Xavisoft/temp/comments{/number}",
                  "issue_comment_url": "https://api.github.com/repos/Xavisoft/temp/issues/comments{/number}",
                  "contents_url": "https://api.github.com/repos/Xavisoft/temp/contents/{+path}",
                  "compare_url": "https://api.github.com/repos/Xavisoft/temp/compare/{base}...{head}",
                  "merges_url": "https://api.github.com/repos/Xavisoft/temp/merges",
                  "archive_url": "https://api.github.com/repos/Xavisoft/temp/{archive_format}{/ref}",
                  "downloads_url": "https://api.github.com/repos/Xavisoft/temp/downloads",
                  "issues_url": "https://api.github.com/repos/Xavisoft/temp/issues{/number}",
                  "pulls_url": "https://api.github.com/repos/Xavisoft/temp/pulls{/number}",
                  "milestones_url": "https://api.github.com/repos/Xavisoft/temp/milestones{/number}",
                  "notifications_url": "https://api.github.com/repos/Xavisoft/temp/notifications{?since,all,participating}",
                  "labels_url": "https://api.github.com/repos/Xavisoft/temp/labels{/name}",
                  "releases_url": "https://api.github.com/repos/Xavisoft/temp/releases{/id}",
                  "deployments_url": "https://api.github.com/repos/Xavisoft/temp/deployments",
                  "created_at": "2022-10-22T13:34:15Z",
                  "updated_at": "2022-10-22T13:34:15Z",
                  "pushed_at": "2022-10-22T13:44:49Z",
                  "git_url": "git://github.com/Xavisoft/temp.git",
                  "ssh_url": "git@github.com:Xavisoft/temp.git",
                  "clone_url": "https://github.com/Xavisoft/temp.git",
                  "svn_url": "https://github.com/Xavisoft/temp",
                  "homepage": null,
                  "size": 0,
                  "stargazers_count": 0,
                  "watchers_count": 0,
                  "language": null,
                  "has_issues": true,
                  "has_projects": true,
                  "has_downloads": true,
                  "has_wiki": true,
                  "has_pages": false,
                  "forks_count": 0,
                  "mirror_url": null,
                  "archived": false,
                  "disabled": false,
                  "open_issues_count": 0,
                  "license": null,
                  "allow_forking": false,
                  "is_template": false,
                  "web_commit_signoff_required": false,
                  "topics": [],
                  "visibility": "private",
                  "forks": 0,
                  "open_issues": 0,
                  "watchers": 0,
                  "default_branch": "main"
               },
               "organization": {
                  "login": "Xavisoft",
                  "id": 88584519,
                  "node_id": "MDEyOk9yZ2FuaXphdGlvbjg4NTg0NTE5",
                  "url": "https://api.github.com/orgs/Xavisoft",
                  "repos_url": "https://api.github.com/orgs/Xavisoft/repos",
                  "events_url": "https://api.github.com/orgs/Xavisoft/events",
                  "hooks_url": "https://api.github.com/orgs/Xavisoft/hooks",
                  "issues_url": "https://api.github.com/orgs/Xavisoft/issues",
                  "members_url": "https://api.github.com/orgs/Xavisoft/members{/member}",
                  "public_members_url": "https://api.github.com/orgs/Xavisoft/public_members{/member}",
                  "avatar_url": "https://avatars.githubusercontent.com/u/88584519?v=4",
                  "description": null
               },
               "sender": {
                  "login": "XavierTM",
                  "id": 22042990,
                  "node_id": "MDQ6VXNlcjIyMDQyOTkw",
                  "avatar_url": "https://avatars.githubusercontent.com/u/22042990?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/XavierTM",
                  "html_url": "https://github.com/XavierTM",
                  "followers_url": "https://api.github.com/users/XavierTM/followers",
                  "following_url": "https://api.github.com/users/XavierTM/following{/other_user}",
                  "gists_url": "https://api.github.com/users/XavierTM/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/XavierTM/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/XavierTM/subscriptions",
                  "organizations_url": "https://api.github.com/users/XavierTM/orgs",
                  "repos_url": "https://api.github.com/users/XavierTM/repos",
                  "events_url": "https://api.github.com/users/XavierTM/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/XavierTM/received_events",
                  "type": "User",
                  "site_admin": false
               }
            }
         };

      default:
         throw new Error('Unknow event type');
   }
}


function generateXHubSignature(hmacSecret, body) {
   const json = JSON.stringify(body);
   const signature = crypto.createHmac('sha256', hmacSecret).update(json).digest('hex');
   return signature;
}



module.exports = {
   generateWebhookPayload,
   generateXHubSignature,
}