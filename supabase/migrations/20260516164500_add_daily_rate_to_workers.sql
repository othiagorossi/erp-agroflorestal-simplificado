DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'workers' AND column_name = 'daily_rate'
  ) THEN
    ALTER TABLE public.workers ADD COLUMN daily_rate numeric NOT NULL DEFAULT 0;
  END IF;
END $$;
