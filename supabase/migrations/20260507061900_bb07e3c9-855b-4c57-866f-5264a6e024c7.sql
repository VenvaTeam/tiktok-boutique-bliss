
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text,
  endereco text,
  cep text,
  numero text,
  amount integer,
  transaction_id text UNIQUE,
  paid boolean NOT NULL DEFAULT false,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
