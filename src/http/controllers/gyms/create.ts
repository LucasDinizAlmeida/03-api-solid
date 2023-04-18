import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { description, latitude, longitude, phone, title } = bodySchema.parse(
    request.body,
  )

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  })

  return reply.code(201).send()
}
