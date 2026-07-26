-- Roll number sequence: 7-digit numbers starting with 303
CREATE SEQUENCE IF NOT EXISTS public.roll_number_seq
  START WITH 3030001
  INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.next_roll_number()
RETURNS TEXT LANGUAGE SQL SECURITY DEFINER SET search_path = public AS $$
  SELECT LPAD(nextval('public.roll_number_seq')::TEXT, 7, '0');
$$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;

UPDATE public.profiles SET roll_number = public.next_roll_number() WHERE roll_number IS NULL;

ALTER TABLE public.profiles ALTER COLUMN roll_number SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_roll_number_key UNIQUE (roll_number);

GRANT USAGE ON SEQUENCE public.roll_number_seq TO service_role;
GRANT EXECUTE ON FUNCTION public.next_roll_number TO service_role;

-- Update trigger to assign roll_number (preserve value from metadata if provided)
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
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
