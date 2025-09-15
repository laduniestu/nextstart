import type { SafeActionResult } from 'next-safe-action';

export function extractActionError(
  res: SafeActionResult<any, any>
): string | null {
  if (res.serverError) return res.serverError;
  if (res.validationErrors?._errors?.length) {
    return res.validationErrors._errors.join(', ');
  }
  return null;
}
