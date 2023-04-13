import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(inMemoryGymsRepository)
  })

  it('should able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: `Javascript gym`,
      description: null,
      phone: null,
      latitude: -21.126087,
      longitude: -41.659033,
    })
    await inMemoryGymsRepository.create({
      title: `Typescript gym`,
      description: null,
      phone: null,
      latitude: -21.126087,
      longitude: -41.659033,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript gym' })])
  })

  it('should able to paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Javascript gym-${i}`,
        description: null,
        phone: null,
        latitude: -21.126087,
        longitude: -41.659033,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript gym-21' }),
      expect.objectContaining({ title: 'Javascript gym-22' }),
    ])
  })
})
