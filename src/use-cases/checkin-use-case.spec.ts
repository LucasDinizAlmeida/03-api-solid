import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './checkin-use-case'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
// import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

    inMemoryGymsRepository.create({
      id: 'gym-id',
      title: 'Javascript gym',
      description: '',
      phone: '',
      latitude: -21.126087,
      longitude: -41.659033,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.126087,
      userLongitude: -41.659033,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.126087,
      userLongitude: -41.659033,
    })

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -21.126087,
        userLongitude: -41.659033,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.126087,
      userLongitude: -41.659033,
    })

    vi.setSystemTime(new Date(2022, 0, 9, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.126087,
      userLongitude: -41.659033,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on distant gym ', async () => {
    await expect(async () => {
      return await sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -20.655168,
        userLongitude: -40.489798,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
