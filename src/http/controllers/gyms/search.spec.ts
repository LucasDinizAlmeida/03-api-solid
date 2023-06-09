import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Search gyms test e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await prisma.gym.createMany({
      data: [
        {
          title: 'JavaScript Gym',
          description: 'some description',
          phone: '1199999999',
          latitude: -21.126087,
          longitude: -41.659033,
        },
        {
          title: 'TypeScript Gym',
          description: 'some description',
          phone: '1199999999',
          latitude: -21.126087,
          longitude: -41.659033,
        },
      ],
    })

    // await request(app.server)
    //   .post('/gyms')
    //   .set('Authorization', `Bearer ${token}`)
    //   .send({
    //     title: 'JavaScript Gym',
    //     description: 'some description',
    //     phone: '1199999999',
    //     latitude: -21.126087,
    //     longitude: -41.659033,
    //   })

    // await request(app.server)
    //   .post('/gyms')
    //   .set('Authorization', `Bearer ${token}`)
    //   .send({
    //     title: 'TypeScript Gym',
    //     description: 'some description',
    //     phone: '1199999999',
    //     latitude: -21.126087,
    //     longitude: -41.659033,
    //   })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
