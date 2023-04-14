import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckIn } from './validate-check-in'
import { ResourceNotFound } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
// import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckIn

describe('Validate Check-In Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckIn(inMemoryCheckInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
    const createCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkInUpdate } = await sut.execute({
      checkInId: createCheckIn.id,
    })

    expect(checkInUpdate.validated_at).toEqual(expect.any(Date))
    expect(inMemoryCheckInsRepository.itens[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should be able to validate an inexistent check-in', async () => {
    await expect(async () => {
      await sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 8, 0, 0))

    const createCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(async () => {
      await sut.execute({
        checkInId: createCheckIn.id,
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
