# Camwood Admin Panel Setup

The website already includes a protected admin dashboard at `/admin.html` with product/category management, website leads, customer product enquiries, visitor events, and order management.

## One-time owner setup

1. Open `/login.html` on the deployed website and create an account using the owner's email address. Confirm the email if Supabase asks you to.
2. Sign in once so the account exists in Supabase Authentication.
3. In the Supabase dashboard, open **SQL Editor** for the Camwood project.
4. Run the following SQL, replacing the email with the exact owner account email:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE')
on conflict (user_id) do nothing;
```

5. Sign in at `/login.html`, then open `/admin.html`.

Only add trusted staff accounts to `public.admin_users`. Admin access is checked by Supabase Row Level Security; do not put a service-role key in any website file.

## Order management

From the dashboard, open **Orders** to add phone/showroom/WhatsApp orders, record the customer, amount and products, and update order/payment statuses. The public website is currently enquiry-led; this does not enable online checkout or online payments.

## Contact form

The public Contact page writes to `public.website_leads` through the `capture-website-lead` Edge Function. The dashboard's **Website leads** tab shows name, phone, email, product/service interest, message, source, status and internal notes.
