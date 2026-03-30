/**
 * admin.ts — Router tRPC para a área administrativa
 * Rotas protegidas: apenas o owner (admin) pode acessar
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import {
  listDiagnosticos,
  getDiagnosticoById,
  listDiarios,
  getDiariosByNome,
  getDiarioById,
  getAdminStats,
} from "../db";

// Middleware: apenas admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao administrador." });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // ── Estatísticas gerais ───────────────────────────────────────────────────
  stats: adminProcedure.query(async () => {
    return getAdminStats();
  }),

  // ── Diagnósticos ──────────────────────────────────────────────────────────
  listDiagnosticos: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      return listDiagnosticos(input.search);
    }),

  getDiagnostico: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const item = await getDiagnosticoById(input.id);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Diagnóstico não encontrado." });
      return item;
    }),

  // ── Diários ───────────────────────────────────────────────────────────────
  listDiarios: adminProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      return listDiarios(input.search);
    }),

  getDiariosByMentorado: adminProcedure
    .input(z.object({ nome: z.string() }))
    .query(async ({ input }) => {
      return getDiariosByNome(input.nome);
    }),

  getDiario: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const item = await getDiarioById(input.id);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Diário não encontrado." });
      return item;
    }),
});
