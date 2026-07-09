
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Storage policies for lecture-docs
CREATE POLICY "Authenticated read lecture-docs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lecture-docs');
CREATE POLICY "Admins upload lecture-docs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lecture-docs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update lecture-docs" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'lecture-docs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete lecture-docs" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lecture-docs' AND public.has_role(auth.uid(), 'admin'));
