import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFound } from './errors/resource-not-found'
// import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUserRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(inMemoryUserRepository)
  })

  it('should be able get user profile', async () => {
    const createUser = await inMemoryUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ id: createUser.id })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able get user profile with wrong id', async () => {
    await inMemoryUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({
        id: 'not-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
