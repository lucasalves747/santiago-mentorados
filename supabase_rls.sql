-- Habilitar RLS nas tabelas
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Políticas para a tabela DIAGNOSTICOS
-- ==========================================
-- 1) Apenas usuários autenticados podem inserir diagnósticos e o registro deve pertencer a eles
CREATE POLICY "Permitir insercao diagnosticos autenticado" 
ON public.diagnosticos FOR INSERT 
TO authenticated
WITH CHECK (new."openId" = auth.uid());

-- 2) Usuários podem visualizar apenas seus próprios diagnósticos
CREATE POLICY "Usuario visualiza seus diagnosticos"
ON public.diagnosticos FOR SELECT 
TO authenticated 
USING ("openId" = auth.uid());

-- 3) Admins visualizam todos os diagnósticos
CREATE POLICY "Admin visualiza todos diagnosticos"
ON public.diagnosticos FOR SELECT 
TO authenticated 
USING ( (SELECT role FROM public.users WHERE "openId" = auth.uid()) = 'admin' );

-- ==========================================
-- Políticas para a tabela DIARIOS
-- ==========================================
-- 1) Qualquer um pode inserir na tabela (Formulário aberto)
CREATE POLICY "Permitir insercao anonima" 
ON public.diarios FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 2) Apenas quem for 'admin' pode visualizar os diários
CREATE POLICY "Admin visualiza todos diarios"
ON public.diarios FOR SELECT 
TO authenticated 
USING ( (SELECT role FROM public.users WHERE "openId" = auth.uid()) = 'admin' );

-- ==========================================
-- Políticas para a tabela USERS
-- ==========================================
-- 1) O usuário autenticado pode ver seu próprio perfil
CREATE POLICY "Ler proprio pefil"
ON public.users FOR SELECT 
TO authenticated 
USING ( "openId" = auth.uid() );

-- 2) Admins tem controle total sobre os usuários
CREATE POLICY "Admin controle total"
ON public.users FOR ALL
TO authenticated 
USING ( (SELECT role FROM public.users WHERE "openId" = auth.uid()) = 'admin' );
