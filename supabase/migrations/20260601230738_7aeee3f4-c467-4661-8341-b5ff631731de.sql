CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  rater_id uuid NOT NULL,
  ratee_id uuid NOT NULL,
  stars int NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, rater_id)
);

GRANT SELECT, INSERT ON public.ratings TO authenticated;
GRANT SELECT ON public.ratings TO anon;
GRANT ALL ON public.ratings TO service_role;

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings public read" ON public.ratings FOR SELECT USING (true);

CREATE POLICY "ratings insert by order participants" ON public.ratings FOR INSERT TO authenticated
WITH CHECK (
  rater_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
      AND o.status = 'delivered'
      AND ((o.customer_id = auth.uid() AND o.driver_id = ratee_id)
        OR (o.driver_id = auth.uid() AND o.customer_id = ratee_id))
  )
);

CREATE INDEX idx_ratings_ratee ON public.ratings(ratee_id);
CREATE INDEX idx_ratings_order ON public.ratings(order_id);

CREATE OR REPLACE VIEW public.user_rating_stats AS
SELECT ratee_id AS user_id,
       ROUND(AVG(stars)::numeric, 2) AS avg_stars,
       COUNT(*)::int AS review_count
FROM public.ratings
GROUP BY ratee_id;

GRANT SELECT ON public.user_rating_stats TO anon, authenticated;