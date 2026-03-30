const request = require('supertest');
const app = require('../server');
const Message = require('../models/message');

describe('Application Routes', () => {
  
  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
  
  test('POST / with empty message should redirect', async () => {
    const response = await request(app)
      .post('/')
      .send({ message: '' });
    expect(response.statusCode).toBe(302);
  });
  
  test('POST / with valid message should redirect', async () => {
    const response = await request(app)
      .post('/')
      .send({ message: 'Test message' });
    expect(response.statusCode).toBe(302);
  });
  
  test('GET /messages/:id should work', (done) => {
    Message.create('Test for route');
    
    setTimeout(() => {
      Message.all((messages) => {
        if (messages && messages.length > 0) {
          const id = messages[0].id;
          request(app)
            .get(`/messages/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    }, 100);
  });
});