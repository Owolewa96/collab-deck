(async () => {
  try {
    const jwt = require('jsonwebtoken');
    const fetch = global.fetch || require('node-fetch');
    const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

    const token = jwt.sign({ id: 'smoke-user-1', email: 'owner-smoke@example.com' }, JWT_SECRET);
    console.log('Generated token length:', String(token).length);

    const base = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create project
    const projRes = await fetch(`${base}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `authToken=${token}` },
      body: JSON.stringify({ name: 'CLI Test Project', priority: 'medium', collaborators: [], description: 'created by smoke test' }),
    });
    const projJson = await projRes.text();
    let proj;
    try { proj = JSON.parse(projJson); } catch (e) { proj = { raw: projJson }; }
    console.log('Create project status:', projRes.status);
    console.log('Create project response:', proj);

    const projectId = proj?.project?._id || proj?.project?._id?._id || (proj.project && proj.project._id) || null;
    if (!projectId) {
      console.error('No project id returned, aborting invite step');
      process.exit(0);
    }

    // Create invite
    const inviteRes = await fetch(`${base}/api/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `authToken=${token}` },
      body: JSON.stringify({ projectId, email: 'invitee-smoke@example.com', message: 'Please join the test project' }),
    });
    const inviteJson = await inviteRes.text();
    let invite;
    try { invite = JSON.parse(inviteJson); } catch (e) { invite = { raw: inviteJson }; }
    console.log('Create invite status:', inviteRes.status);
    console.log('Create invite response:', invite);

    // List invites
    const listRes = await fetch(`${base}/api/invites`, { method: 'GET', headers: { Cookie: `authToken=${token}` } });
    const listJson = await listRes.text();
    let list;
    try { list = JSON.parse(listJson); } catch (e) { list = { raw: listJson }; }
    console.log('List invites status:', listRes.status);
    console.log('List invites response:', list);

  } catch (err) {
    console.error('Smoke script error:', err);
    process.exit(1);
  }
})();
