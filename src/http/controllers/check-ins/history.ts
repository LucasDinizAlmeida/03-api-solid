import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = searchGymsQuerySchema.parse(request.query)

  const fetchuserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchuserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.code(200).send({
    checkIns,
  })
}
