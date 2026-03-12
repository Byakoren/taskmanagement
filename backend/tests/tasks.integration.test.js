const request = require('supertest');
const app = require('../server');

describe('Tasks API - Integration', () => {
  let token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });

    token = loginResponse.body.token;
  });

  test('GET /api/tasks should require authentication', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token d'accès requis");
  });

  test('POST /api/tasks should create task when authenticated', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nouvelle tâche de test',
        description: 'Description de test',
        priority: 'high'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Nouvelle tâche de test');
    expect(response.body.status).toBe('todo');
    expect(response.body.priority).toBe('high');
  });

  test('CRUD complet sur /api/tasks/:id', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tâche CRUD', description: 'Initiale', priority: 'low' });

    const taskId = createResponse.body.id;

    const readResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body.id).toBe(taskId);

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done', title: 'Tâche CRUD modifiée' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe('done');
    expect(updateResponse.body.title).toBe('Tâche CRUD modifiée');

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);

    const afterDeleteRead = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(afterDeleteRead.status).toBe(404);
  });
});
