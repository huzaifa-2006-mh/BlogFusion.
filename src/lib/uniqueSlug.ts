import prisma from './prisma';
import { slugify } from './blogUrl';

export async function ensureUniqueSlug(desired: string, excludeId?: string): Promise<string> {
  const base = slugify(desired) || 'post';
  let n = 0;

  while (true) {
    const candidate = n === 0 ? base : `${base}-${n}`;
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }
    n += 1;
  }
}
