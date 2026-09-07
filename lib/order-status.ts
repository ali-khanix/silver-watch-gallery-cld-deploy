import { prisma } from "@/lib/prisma";

// All statuses an order can have.
export const ALL_ORDER_STATUSES = [
  "pending",
  "accepted",
  "delivered",
  "returned",
  "refused",
] as const;

export type OrderStatus = (typeof ALL_ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  accepted: "تایید شده",
  delivered: "تحویل شده",
  returned: "مرجوع شده",
  refused: "رد شده",
};

// The 3 buckets shown on the user's profile card.
// Adjust freely if you'd rather count "refused" separately from "returned".
export const ORDER_STATUS_GROUPS = {
  inProgress: ["pending", "accepted"] as OrderStatus[],
  delivered: ["delivered"] as OrderStatus[],
  returned: ["returned", "refused"] as OrderStatus[],
};

export async function getOrderStatusCounts(userId: string) {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    where: { userId },
    _count: { _all: true },
  });

  const countFor = (statuses: OrderStatus[]) =>
    grouped
      .filter((g) => statuses.includes(g.status as OrderStatus))
      .reduce((sum, g) => sum + g._count._all, 0);

  return {
    inProgress: countFor(ORDER_STATUS_GROUPS.inProgress),
    delivered: countFor(ORDER_STATUS_GROUPS.delivered),
    returned: countFor(ORDER_STATUS_GROUPS.returned),
  };
}
