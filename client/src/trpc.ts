import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/routers';

export const trpc = createTRPCReact<AppRouter>();

// 用于客户端的trpc客户端
export function createClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        fetch(input, init) {
          return globalThis.fetch(input, {
            ...(init ?? {}),
            credentials: 'include',
          });
        },
      }),
    ],
  });
}
