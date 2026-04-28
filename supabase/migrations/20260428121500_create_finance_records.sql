CREATE TABLE IF NOT EXISTS public.finance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  cost_center_type TEXT NOT NULL,
  cost_center TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own finance records" ON public.finance_records;
CREATE POLICY "Users can view their own finance records" ON public.finance_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own finance records" ON public.finance_records;
CREATE POLICY "Users can insert their own finance records" ON public.finance_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own finance records" ON public.finance_records;
CREATE POLICY "Users can update their own finance records" ON public.finance_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own finance records" ON public.finance_records;
CREATE POLICY "Users can delete their own finance records" ON public.finance_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
