import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const parmasSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = parmasSchema.parse(request.params)

  const validateCheckInuseCase = makeValidateCheckInUseCase()

  await validateCheckInuseCase.execute({
    checkInId,
  })

  return reply.code(204).send()
}
