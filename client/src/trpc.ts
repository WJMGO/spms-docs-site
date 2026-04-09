import { createTRPCMsw, createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/routers';

export const trpc = createTRPCReact<AppRouter>();

export const trpcMsw = createTRPCMsw();

// 用于客户端的trpc客户端
export function createClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
      }),
    ],
  });
}