import { GetUserProfileUseCase } from '../get-user-profile'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUserRepository()
  const useCase = new GetUserProfileUseCase(userRepository)

  return useCase
}
