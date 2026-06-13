
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS proof_photo_url text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE POLICY "driver upload delivery proof"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'delivery-proofs'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id::text = (storage.foldername(name))[1]
      AND o.driver_id = auth.uid()
  )
);

CREATE POLICY "involved read delivery proof"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'delivery-proofs'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id::text = (storage.foldername(name))[1]
      AND (o.customer_id = auth.uid() OR o.driver_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
