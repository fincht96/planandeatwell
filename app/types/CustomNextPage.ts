import type { NextPage } from 'next';

export type CustomNextPage = NextPage & { requireAuth: boolean };
