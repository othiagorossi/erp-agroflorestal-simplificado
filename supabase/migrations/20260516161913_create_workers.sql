DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    culture TEXT NOT NULL,
    period TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.worker_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('shift', 'payment')),
    date DATE NOT NULL,
    days NUMERIC,
    amount NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- RLS for workers
  ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Users can view their own workers" ON public.workers;
  CREATE POLICY "Users can view their own workers" ON public.workers
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
    
  DROP POLICY IF EXISTS "Users can insert their own workers" ON public.workers;
  CREATE POLICY "Users can insert their own workers" ON public.workers
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own workers" ON public.workers;
  CREATE POLICY "Users can update their own workers" ON public.workers
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can delete their own workers" ON public.workers;
  CREATE POLICY "Users can delete their own workers" ON public.workers
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

  -- RLS for worker_records
  ALTER TABLE public.worker_records ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Users can view their own worker_records" ON public.worker_records;
  CREATE POLICY "Users can view their own worker_records" ON public.worker_records
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can insert their own worker_records" ON public.worker_records;
  CREATE POLICY "Users can insert their own worker_records" ON public.worker_records
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update their own worker_records" ON public.worker_records;
  CREATE POLICY "Users can update their own worker_records" ON public.worker_records
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can delete their own worker_records" ON public.worker_records;
  CREATE POLICY "Users can delete their own worker_records" ON public.worker_records
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
END $$;
