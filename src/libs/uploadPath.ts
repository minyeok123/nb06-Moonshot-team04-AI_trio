export function toRelativeUploadPath(input?: string | null): string | null {
  if (!input) return null;

  // 이미 상대경로
  if (input.startsWith('/uploads/')) return input;

  // 절대 URL → 상대경로로 변환
  const idx = input.indexOf('/uploads/');
  if (idx !== -1) {
    return input.slice(idx);
  }

  return null;
}
