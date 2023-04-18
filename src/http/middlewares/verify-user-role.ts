import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(verifyRole: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== verifyRole) {
      return reply.code(401).send('Unauthorized')
    }
  }
}
