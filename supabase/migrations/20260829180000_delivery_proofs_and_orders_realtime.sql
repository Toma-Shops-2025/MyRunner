-- Fix delivery-proof storage RLS + ensure orders realtime (live-safe casts).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'delivery-proofs',
  'delivery-proofs',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "driver upload delivery proof" ON storage.objects;
CREATE POLICY "driver upload delivery proof"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'delivery-proofs'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id::text = (storage.foldername(name))[1]
      AND o.driver_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "involved read delivery proof" ON storage.objects;
CREATE POLICY "involved read delivery proof"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'delivery-proofs'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id::text = (storage.foldername(name))[1]
      AND (
        o.customer_id::text = auth.uid()::text
        OR o.driver_id::text = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id::text = auth.uid()::text
            AND ur.role::text = 'admin'
        )
      )
  )
);

-- Realtime: customers see status changes without refresh
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_messages REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
