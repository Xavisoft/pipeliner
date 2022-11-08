

function processWebhookPayload(payload) {
   const { headers, body } = payload;

   let repository, organization, data, event;

   // detect event
   const eventHeader = headers['x-github-event'];

   if (eventHeader === 'create' && body.ref_type === 'tag') {
      // new tag
      const tag = body.ref;
      const branch = body.master_branch;

      data = { branch, tag };
      event = 'new_tag';

   } else if (eventHeader === 'push') {
      // push
      const branch = body.ref.substring("refs/heads/".length);
      data = { branch };
      event = 'push';

   } else if (eventHeader === 'pull_request' && body.action === 'opened') {
      // pull_request
      const branch = body.pull_request.head.ref;
      const base_branch = body.pull_request.base.ref

      data = { branch, base_branch };
      event = 'pull_request';
   
   } else if (eventHeader === 'pull_request' && body.action === 'closed' && body.pull_request.merged_at) {
      // merge
      const branch = body.pull_request.head.ref;
      const base_branch = body.pull_request.base.ref

      data = { branch, base_branch };
      event = 'merge';

   } else if (eventHeader === 'release' && body.action === 'published') {
      // release
      const branch = body.release.target_commitish;
      const tag = body.release.tag_name;

      data = { branch, tag };
      event = 'release';

   } else if (eventHeader === 'create' && body.ref_type === 'branch') {
      // new branch
      const branch = body.ref;

      data = { branch };
      event = 'new_branch';

   }


   if (body.repository) {
      repository = body.repository.name;
   }

   if (body.organization) {
      organization = body.organization.login;
   } else {
      organization = body.repository.full_name.split('/')[0];
   }

   return {
      originalPayload: payload,
      repository,
      organization,
      data,
      event
   }
}



module.exports = {
   processWebhookPayload
}