import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  const [, navigate] = useLocation();
    
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSupabaseUser(data.session?.user ?? null);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth-me', supabaseUser?.id],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!supabaseUser && !sessionLoading,
    queryFn: async () => {
        if (!supabaseUser) return null;
        const { data, error } = await supabase.from('users').select('*').eq('openId', supabaseUser.id).single();
        if (error) {
            // Se o usuário logou pela primeira vez no Supabase, a linha em "users" pode não existir. Vamos inseri-la:
            if (error.code === 'PGRST116') { // HTTP 406 Not Found no single()
                const newUser = {
                    openId: supabaseUser.id,
                    email: supabaseUser.email || null,
                    role: 'user', 
                    name: supabaseUser.user_metadata?.name || null
                };
                await supabase.from('users').insert(newUser);
                return newUser;
            }
            throw error;
        }
        return data; // retorna DB local user com name, email, role
    }
  });

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(['auth-me', supabaseUser?.id], null);
    await queryClient.invalidateQueries({ queryKey: ['auth-me'] });
  }, [queryClient, supabaseUser?.id]);

  const state = useMemo(() => {
    const user = meQuery.data ?? null;
    const loading = sessionLoading || (!!supabaseUser && meQuery.isLoading);
    
    return {
      user,
      loading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(user),
    };
  }, [supabaseUser, sessionLoading, meQuery.data, meQuery.isLoading, meQuery.error]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (state.loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    // First attempt client-side redirect through wouter.
    // If that does not update the route for any reason, fallback to a hard redirect.
    try {
      navigate(redirectPath);
    } catch {
      window.location.href = redirectPath;
    }
  }, [redirectOnUnauthenticated, redirectPath, state.loading, state.user, navigate]);

  return { ...state, refresh: () => meQuery.refetch(), logout };
}
