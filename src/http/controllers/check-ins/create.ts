import { makeCheckinUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const bodySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const parmsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = bodySchema.parse(request.body)
  const { gymId } = parmsSchema.parse(request.params)

  const createGymUseCase = makeCheckinUseCase()

  await createGymUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.code(201).send()
}
