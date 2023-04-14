import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify()

  console.log(request.user.sub)

  return reply.code(201).send()
}
