import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { checkSessionIdExist } from '../middlewares/check-session-id-exist';
import moment from 'moment-timezone';

export async function mealsRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (request) => {
  //   console.log(`[${request.method}] ${request.url}`);
  // });

  app.post(
    '/', 
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        on_diet: z.boolean(),
        date: z.coerce.date()
      });
      const { name, description, on_diet, date } = bodySchema.parse(request.body);

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        on_diet,
        date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
        user_id: request.user?.id
      });

      return reply.status(201).send();
    }
  );

  app.get(
    '/',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id})
        .orderBy('date', 'desc');

      return reply.status(200).send({ meals });
    }
  );

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid()
      });
      const { id } = paramsSchema.parse(request.params);

      const meal = await knex('meals')
        .where({
          id,
          user_id: request.user?.id
        })
        .first();
      
      if (!meal) {
        return reply.status(404).send({
          error: 'Meal not found'
        });
      }

      return reply.status(200).send({ meal });
    }
  );

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc');

      const { totalMeals, mealsOnDiet, mealsOffDiet, bestSequenceOnDiet } = meals.reduce(
        (acc, meal) => {
          acc.totalMeals++;

          if (meal.on_diet) {
            acc.mealsOnDiet++;
            acc.currentSquence++;
          }
          else {
            acc.mealsOffDiet++;
            acc.currentSquence = 0;
          }

          if (acc.currentSquence > acc.bestSequenceOnDiet) {
            acc.bestSequenceOnDiet = acc.currentSquence;
          }
     
          return acc;
        },
        { 
          totalMeals: 0, 
          mealsOnDiet: 0, 
          mealsOffDiet: 0, 
          bestSequenceOnDiet: 0,
          currentSquence: 0
        }
      );

      const metrics = {
        total_meals: totalMeals,
        total_meals_on_diet: mealsOnDiet,
        total_meals_off_diet: mealsOffDiet,
        best_sequence_on_diet: bestSequenceOnDiet
      };

      return reply.status(200).send({ metrics });
    }
  );

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid()
      });
      const { id } = paramsSchema.parse(request.params);

      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        on_diet: z.boolean(),
        date: z.coerce.date()
      });
      const { name, description, on_diet, date } = bodySchema.parse(request.body);

      const meal = await knex('meals')
        .where({
          id,
          user_id: request.user?.id
        })
        .first();

      if (!meal) {
        return reply.status(404).send({
          error: 'Meal not found'
        });
      }

      await knex('meals')
        .where({ id })
        .update({
          name,
          description,
          on_diet,
          date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
          updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        });

      return reply.status(204).send();
    }
  );

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid()
      });
      const { id } = paramsSchema.parse(request.params);

      const meal = await knex('meals')
        .where({
          id,
          user_id: request.user?.id
        })
        .first();

      if (!meal) {
        return reply.status(404).send({
          error: 'Meal not found'
        });
      }

      await knex('meals')
        .where({ id })
        .delete();

      return reply.status(204).send();
    }
  );
}