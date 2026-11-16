import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, cp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

test('custom deployment settings agree in the feed and widget', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'alpine-build-'));
  try {
    await cp('public', join(directory, 'public'), {recursive: true});
    execFileSync(process.execPath, [resolve('scripts/build.mjs')], {
      cwd: directory,
      env: {...process.env, SITE_ORIGIN: 'https://shop.example', ASSISTANT_ORIGIN: 'https://assistant.example', ASSISTANT_SITE_ID: 'my-shop'},
    });
    const feed = JSON.parse(await readFile(join(directory, 'dist/assistant-content.json'), 'utf8'));
    const html = await readFile(join(directory, 'dist/index.html'), 'utf8');
    assert.equal(feed.siteId, 'my-shop');
    assert.equal(feed.origin, 'https://shop.example');
    assert.match(html, /src="https:\/\/assistant\.example\/widget\.js" data-site="my-shop"/);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});
