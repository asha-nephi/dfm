-- Supabase's default-privileges hook re-grants anon EXECUTE on new functions
-- after creation, which silently undid the revoke issued in the same
-- migration as CREATE FUNCTION. Revoking again here, as its own statement
-- after that hook has already fired, makes it stick.
revoke execute on function public.artisan_update_work_order(uuid, text, jsonb) from anon;
revoke execute on function public.handle_auth_user_confirmed() from public, anon, authenticated;

alter function public.set_updated_at() set search_path = public;
