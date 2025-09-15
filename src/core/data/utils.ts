import 'server-only';
import z from 'zod';
import { db } from '@/db';
import { user } from '@/db/schema';
export const userKeys = Object.keys(user) as (keyof typeof user)[];

export const userTableSearchParamsSchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),
  perPage: z
    .preprocess((val) => Number(val), z.number().int().min(1))
    .default(10),
  sort: z.any(),
  from: z.string().default(''),
  to: z.string().default(''),
  name: z.string().default(''),
});

export async function createTransaction<T extends typeof db, R>(
  cb: (trx: T) => Promise<R>
): Promise<R> {
  return db.transaction(async (trx) => {
    // @ts-expect-error idk
    return cb(trx);
  });
}
