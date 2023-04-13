import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public itens: CheckIn[] = []

  async findById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = this.itens.find((item) => item.id === checkInId)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.itens.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.itens[checkInIndex] = checkIn
    }

    return checkIn
  }

  async countByUserId(userId: string) {
    return this.itens.filter((item) => item.user_id === userId).length
  }

  async findByIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDay = this.itens.find((item) => {
      const checkInDate = dayjs(item.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return item.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDay) {
      return null
    }

    return checkInOnSameDay
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.itens
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: 'chechIn-1',
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date() : null,
      created_at: new Date(),
    }

    this.itens.push(checkIn)

    return checkIn
  }
}
