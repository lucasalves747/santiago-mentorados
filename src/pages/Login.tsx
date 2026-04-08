import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

export function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [_, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        setError(error.message);
        setSuccessMessage(null);
      } else {
        setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
        setError(null);
        setIsRegister(false);
        setName("");
        setPassword("");
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Login</h1>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Entre com seu e-mail e senha para acessar o painel.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 mb-4 text-sm text-emerald-300 bg-emerald-950/50 border border-emerald-900 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (isRegister ? "Registrando..." : "Entrando...") : (isRegister ? "Criar conta" : "Entrar")}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-400">
          {isRegister ? (
            <button type="button" className="underline hover:text-white" onClick={() => setIsRegister(false)}>
              Já tenho conta. Fazer login
            </button>
          ) : (
            <button type="button" className="underline hover:text-white" onClick={() => setIsRegister(true)}>
              Ainda não tem conta? Criar conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
