
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { diagnosticoRouter } from "./routers/diagnostico";
import { diarioRouter } from "./routers/diario";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
  }),
  diagnostico: diagnosticoRouter,
  diario: diarioRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
