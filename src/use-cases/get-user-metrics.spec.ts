import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetrics } from './get-user-metrics'

let inMemoryCheckinsRepository: InMemoryCheckInsRepository
let sut: GetUserMetrics

describe('Get user metrics Use Case', () => {
  beforeEach(() => {
    inMemoryCheckinsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetrics(inMemoryCheckinsRepository)
  })

  it('should able to get check-ins count from metrics ', async () => {
    await inMemoryCheckinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await inMemoryCheckinsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { countCheckIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(countCheckIns).toEqual(2)
  })
})
