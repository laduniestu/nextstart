import 'server-only';

export async function register() {
  await import('./lib/orpc/server');
}
