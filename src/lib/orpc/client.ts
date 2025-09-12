import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { BatchLinkPlugin } from '@orpc/client/plugins';
import type { RouterClient } from '@orpc/server';
import { createRouterUtils } from '@orpc/tanstack-query';
import type { router } from './routers';

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/v1`,
  plugins: [
    new BatchLinkPlugin({
      groups: [
        {
          condition: () => true,
          context: {},
        },
      ],
    }),
  ],
});

export const orpcClient: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

export const orpcQuery = createRouterUtils(orpcClient);
