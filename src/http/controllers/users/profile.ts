import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    id: request.user.sub,
  })

  return reply.code(201).send({
    ...user,
    password_hash: undefined,
  })
}
