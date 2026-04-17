alter table public."OrderItem"
enable row level security;

create policy "service_role can manage OrderItem"
on public."OrderItem"
as permissive
for all
to service_role
using (true)
with check (true);
