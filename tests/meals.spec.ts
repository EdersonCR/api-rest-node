import { afterAll, beforeAll, describe, beforeEach, expect, test } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';
import moment from 'moment';

describe('Meals routes', () => {
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

  test('should be able to created a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'David Gilmour',
        email: 'davidgilmour@pinkfloyd.com'
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata',
        on_diet: false,
        date: new Date()
      })
      .expect(201);
  });

  test('should be able to list all meals from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'David Gilmour',
        email: 'davidgilmour@pinkfloyd.com'
      });

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata frita',
        on_diet: false,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Jantar',
        description: 'Arroz, salada e carne',
        on_diet: true,
        date: moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    expect(mealsResponse.body.meals).toHaveLength(2);
    expect(mealsResponse.body.meals[0].name).toBe('Jantar');
    expect(mealsResponse.body.meals[1].name).toBe('Almoço');
  });

  test('should be able to show a single meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'David Gilmour',
        email: 'davidgilmour@pinkfloyd.com'
      });

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata frita',
        on_diet: false,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    expect(mealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata frita',
        on_diet: 0,
        date: expect.any(Number),
      }),
    );
  });

  test('should be able to update a meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'David Gilmour',
        email: 'davidgilmour@pinkfloyd.com'
      });

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata frita',
        on_diet: true,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Churrasco',
        description: 'Linguiça, picanha e pão de alho',
        on_diet: false,
        date: moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(204);

  });

  test('should be able to delete a meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Roger Waters',
        email: 'rogerwaters@pinkfloyd.com'
      });

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão, bife e batata frita',
        on_diet: false,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(204);

  });

  test('should be able to get metrics from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Syd Barrett',
        email: 'sydbarrett@pinkfloyd.com'
      });

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Café da manhã',
        description: 'Pão e café',
        on_diet: true,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Almoço',
        description: 'Arroz, feijão e macarrão',
        on_diet: false,
        date: moment().add(4, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Café da tarde',
        description: 'Iogurte e fruta',
        on_diet: true,
        date: moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Jantar',
        description: 'Arroz, carne e salada',
        on_diet: true,
        date: moment().add(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .send({
        name: 'Café da manhã',
        description: 'Pão e café',
        on_diet: true,
        date: moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
      })
      .expect(201);

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', userResponse.get('Set-Cookie') ?? [])
      .expect(200);

    expect(metricsResponse.body.metrics).toEqual({
      total_meals: 5,
      total_meals_on_diet: 4,
      total_meals_off_diet: 1,
      best_sequence_on_diet: 3
    });
  });

});

