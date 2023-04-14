import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

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

    const distanceinMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceinMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    const checkInUpdate = await this.checkInRepository.save(checkIn)

    return { checkInUpdate }
  }
}
