import type { InferRouterOutputs } from '@orpc/server';
import type { router } from './routers';

export type Outputs = InferRouterOutputs<typeof router>;

export type UserTableOutput = Outputs['user']['table'];
