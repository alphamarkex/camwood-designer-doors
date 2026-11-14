-- Public catalogue: anyone may READ published categories/products and product photos.
-- Only admins (public.admin_users) can create/edit. Safe to run more than once.

alter table public.product_categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public read published categories" on public.product_categories;
create policy "Public read published categories" on public.product_categories
  for select to anon, authenticated using (is_published = true);

drop policy if exists "Public read published products" on public.products;
create policy "Public read published products" on public.products
  for select to anon, authenticated using (is_published = true);

drop policy if exists "Admins manage categories" on public.product_categories;
create policy "Admins manage categories" on public.product_categories
  for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Product photo bucket (public read, admin write)
insert into storage.buckets (id, name, public) values ('camwood-products', 'camwood-products', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read product photos" on storage.objects;
create policy "Public read product photos" on storage.objects
  for select to anon, authenticated using (bucket_id = 'camwood-products');

drop policy if exists "Admins upload product photos" on storage.objects;
create policy "Admins upload product photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'camwood-products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "Admins delete product photos" on storage.objects;
create policy "Admins delete product photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'camwood-products' and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
