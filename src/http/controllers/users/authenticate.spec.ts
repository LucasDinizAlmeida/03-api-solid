import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate test e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/session').send({
      email: 'lucas@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
