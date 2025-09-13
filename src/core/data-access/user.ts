import 'server-only';
import { db } from '@/db';

export async function getUsers() {
  const user = await db.query.user.findMany();
  return user;
}
