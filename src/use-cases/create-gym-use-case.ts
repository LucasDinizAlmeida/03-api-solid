import { Gym } from '@prisma/client'
import { GymRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  id?: string
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) { }

  async execute({
    id,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      id,
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
