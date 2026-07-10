
DROP POLICY IF EXISTS "Authenticated view documents" ON public.lecture_documents;
CREATE POLICY "Authenticated view documents of published courses"
ON public.lecture_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.lectures l
    JOIN public.courses c ON c.id = l.course_id
    WHERE l.id = lecture_documents.lecture_id
      AND (c.is_published OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

DROP POLICY IF EXISTS "Authenticated read lecture-docs" ON storage.objects;
CREATE POLICY "Authenticated read lecture-docs of published courses"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lecture-docs'
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.lectures l
      JOIN public.courses c ON c.id = l.course_id
      WHERE l.id::text = (storage.foldername(name))[1]
        AND c.is_published
    )
  )
);
