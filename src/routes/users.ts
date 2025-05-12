import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';

export async function usersRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (request) => {
  //   console.log(`[${request.method}] ${request.url}`);
  // });

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    });

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }

    const { name, email } = bodySchema.parse(request.body);

    const user = await knex('users').where({ email }).first();

    if (user) {
      return reply.status(400).send({
        message: 'User already exists'
      });
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    });

    return reply.status(201).send();
  });
}