import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
  })

  it('should able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'gym-close',
      description: null,
      phone: null,
      latitude: -21.126087,
      longitude: -41.659033,
    })

    await inMemoryGymsRepository.create({
      title: 'gym-distant',
      description: null,
      phone: null,
      latitude: -21.204708,
      longitude: -41.882323,
    })

    const { gyms } = await sut.execute({
      userLatitude: -21.126087,
      userLongitude: -41.659033,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-close' })])
  })
})
