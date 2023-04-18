import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const fetchuserCheckInsHistoryUseCase = makeGetUserMetricsUseCase()

  const { countCheckIns } = await fetchuserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  })

  return reply.code(200).send({
    countCheckIns,
  })
}
