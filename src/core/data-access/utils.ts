/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import { db } from '@/db';

export async function createTransaction<T extends typeof db, R>(
  cb: (trx: T) => Promise<R>
): Promise<R> {
  return db.transaction((trx) => {
    // @ts-expect-error idk
    return cb(trx);
  });
}
