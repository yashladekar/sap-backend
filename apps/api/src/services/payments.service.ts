import { prisma } from "../lib/prisma.js";
import type {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaginationParams,
} from "../types/index.js";

export class PaymentsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.payment.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: CreatePaymentDto) {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePaymentDto) {
    return prisma.payment.update({
      where: { id },
      data: {
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }
}

export const paymentsService = new PaymentsService();
