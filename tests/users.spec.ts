import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });


  it('should be able to created a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Roger Waters',
        email: 'rogerwaters@pinkfloyd.com'
      })
      .expect(201);

    const cookies = response.get('Set-Cookie');
    
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    );
  });

});

