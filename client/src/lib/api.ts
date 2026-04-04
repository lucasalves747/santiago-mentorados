import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";

// Usando any interno para pular complexidade de tipagens Drizzle quebradas por falta do backend
// Mas a interface exposta para os componentes continua segura.

export const api = {
  admin: {
    stats: {
      useQuery(params?: undefined, opts?: { enabled?: boolean }) {
        return useQuery({
          queryKey: ['admin-stats'],
          queryFn: async () => {
             const [diagRes, diariosRes] = await Promise.all([
               supabase.from('diagnosticos').select('id', { count: 'exact' }),
               supabase.from('diarios').select('id', { count: 'exact' }),
             ]);
             
             const nomes = await supabase.from('diarios').select('nome');
             let mentoradosAtivos = 0;
             if (nomes.data) {
                const uniqueNames = new Set(nomes.data.map(d => d.nome).filter(Boolean));
                mentoradosAtivos = uniqueNames.size;
             }
             
             return {
                totalDiagnosticos: diagRes.count || 0,
                totalDiarios: diariosRes.count || 0,
                mentoradosAtivos,
             }
          },
          enabled: opts?.enabled !== false
        });
      }
    },
    listDiagnosticos: {
      useQuery(params?: { search?: string }, opts?: { enabled?: boolean }) {
        return useQuery({
          queryKey: ['admin-diagnosticos', params?.search],
          queryFn: async () => {
            let q = supabase.from('diagnosticos').select('*').order('createdAt', { ascending: false }).limit(100);
            if (params?.search) {
               q = q.ilike('nome', `%${params.search}%`);
            }
            const { data, error } = await q;
            if (error) throw error;
            return data || [];
          },
          enabled: opts?.enabled !== false
        });
      }
    },
    listDiarios: {
      useQuery(params?: { search?: string }, opts?: { enabled?: boolean }) {
        return useQuery({
          queryKey: ['admin-diarios', params?.search],
          queryFn: async () => {
             let q = supabase.from('diarios').select('*').order('createdAt', { ascending: false }).limit(200);
             if (params?.search) {
               q = q.ilike('nome', `%${params.search}%`);
            }
            const { data, error } = await q;
            if (error) throw error;
            return data || [];
          },
          enabled: opts?.enabled !== false
        });
      }
    },
    getDiariosByMentorado: {
      useQuery(params: { nome: string }, opts?: { enabled?: boolean }) {
         return useQuery({
            queryKey: ['admin-diarios-mentorado', params.nome],
            queryFn: async () => {
               const { data, error } = await supabase.from('diarios')
                  .select('*')
                  .ilike('nome', `%${params.nome}%`)
                  .order('data', { ascending: false })
                  .limit(90);
               if (error) throw error;
               return data || [];
            },
            enabled: opts?.enabled !== false
         });
      }
    },
    getDiagnostico: {
      useQuery(params: { id: number }, opts?: { enabled?: boolean }) {
          return useQuery({
             queryKey: ['admin-diagnostico', params.id],
             queryFn: async () => {
                const { data, error } = await supabase.from('diagnosticos').select('*').eq('id', params.id).single();
                if (error) throw error;
                return data;
             },
             enabled: opts?.enabled !== false
          });
      }
    },
    getDiario: {
       useQuery(params: { id: number }, opts?: { enabled?: boolean }) {
          return useQuery({
             queryKey: ['admin-diario', params.id],
             queryFn: async () => {
                const { data, error } = await supabase.from('diarios').select('*').eq('id', params.id).single();
                if (error) throw error;
                return data;
             },
             enabled: opts?.enabled !== false
          });
      }
    }
  },
  diario: {
    submit: {
      useMutation(opts?: { onSuccess?: (data: any) => void, onError?: (error: Error) => void, onSettled?: () => void }) {
         return useMutation({
            mutationFn: async (vars: any) => {
               const { data, error } = await supabase.from('diarios').insert(vars).select().single();
               if (error) throw error;
               return data;
            },
            ...opts
         });
      }
    }
  },
  diagnostico: {
    submit: {
      useMutation(opts?: { onSuccess?: (data: any) => void, onError?: (error: Error) => void, onSettled?: () => void }) {
         return useMutation({
            mutationFn: async (vars: any) => {
               const { data, error } = await supabase.from('diagnosticos').insert(vars).select().single();
               if (error) throw error;
               return data;
            },
            ...opts
         });
      }
    }
  }
};
