import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsRequest {
  userId: string
}
interface GetUserMetricsResponse {
  countCheckIns: number
}

export class GetUserMetrics {
  constructor(private checkInRepository: CheckInsRepository) { }

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const countCheckIns = await this.checkInRepository.countByUserId(userId)

    return { countCheckIns }
  }
}
