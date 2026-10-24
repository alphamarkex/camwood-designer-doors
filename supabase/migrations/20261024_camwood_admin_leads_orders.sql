-- Camwood admin lead and manual order management.
-- Public visitors can submit leads only through the capture-website-lead Edge Function.
ALTER TABLE public.website_leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.website_leads DROP CONSTRAINT IF EXISTS website_leads_status_check;
ALTER TABLE public.website_leads ADD CONSTRAINT website_leads_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed'));

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('CW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  items_summary text NOT NULL DEFAULT '',
  amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  order_status text NOT NULL DEFAULT 'new'
    CHECK (order_status IN ('new', 'confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled')),
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'not_applicable')),
  notes text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read website leads" ON public.website_leads;
CREATE POLICY "Admins read website leads" ON public.website_leads
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins update website leads" ON public.website_leads;
CREATE POLICY "Admins update website leads" ON public.website_leads
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

CREATE INDEX IF NOT EXISTS website_leads_created_at_idx ON public.website_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS website_leads_status_idx ON public.website_leads (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_order_status_idx ON public.orders (order_status);
