import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'

interface ValidateCheckInRequest {
  checkInId: string
}
interface ValidateCheckInResponse {
  checkInUpdate: CheckIn
}

export class ValidateCheckIn {
  constructor(private checkInRepository: CheckInsRepository) { }

  async execute({
    checkInId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    checkIn.validated_at = new Date()

    const checkInUpdate = await this.checkInRepository.save(checkIn)

    return { checkInUpdate }
  }
}
