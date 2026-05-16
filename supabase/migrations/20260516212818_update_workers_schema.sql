-- Drop constraints on workers table to allow generic workers
ALTER TABLE public.workers ALTER COLUMN culture DROP NOT NULL;
ALTER TABLE public.workers ALTER COLUMN period DROP NOT NULL;

-- Add culture column to worker_records for daily shift tracking
ALTER TABLE public.worker_records ADD COLUMN IF NOT EXISTS culture TEXT;
