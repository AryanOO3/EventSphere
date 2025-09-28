const request = require('supertest');
const app = require('../index');

describe('Auth Endpoints', () => {
  test('POST /api/auth/register should create user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/auth/login should authenticate user', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});