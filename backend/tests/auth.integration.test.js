const request = require('supertest');
const app = require('../server');

describe('Auth API - Integration', () => {
  test('POST /api/auth/login should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('admin@test.com');
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrong-password' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Identifiants invalides');
  });

  test('POST /api/auth/register should create a new user', async () => {
    const uniqueEmail = `user_${Date.now()}@test.com`;

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      email: uniqueEmail,
      name: 'Test User'
    });
  });

  test('POST /api/auth/register should reject duplicate email', async () => {
    const duplicateEmail = `dup_${Date.now()}@test.com`;

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'First User',
        email: duplicateEmail,
        password: 'password123'
      });

    const secondAttempt = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second User',
        email: duplicateEmail,
        password: 'password123'
      });

    expect(secondAttempt.status).toBe(400);
    expect(secondAttempt.body.error).toBe('Utilisateur déjà existant');
  });
});
