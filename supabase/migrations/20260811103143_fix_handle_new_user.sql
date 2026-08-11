CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _roll_number TEXT;
BEGIN
  _roll_number := COALESCE(
    NEW.raw_user_meta_data->>'roll_number',
    public.next_roll_number()
  );

  INSERT INTO public.profiles (id, full_name, roll_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    _roll_number
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
