import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile test e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Lucas',
      email: 'lucas@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      email: 'lucas@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(201)
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        email: 'lucas@example.com',
      }),
    )
  })
})
