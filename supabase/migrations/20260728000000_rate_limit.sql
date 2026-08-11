CREATE TABLE IF NOT EXISTS public.rate_limits (
    identifier text PRIMARY KEY,
    count integer NOT NULL DEFAULT 1,
    last_request_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Allow service role to manage rate limits
GRANT ALL ON TABLE public.rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier text,
    p_max_requests integer,
    p_window_seconds integer
) RETURNS boolean AS $$
DECLARE
    v_count integer;
    v_last_request_at timestamp with time zone;
BEGIN
    INSERT INTO public.rate_limits (identifier, count, last_request_at)
    VALUES (p_identifier, 1, now())
    ON CONFLICT (identifier) DO UPDATE
    SET count = CASE
            WHEN now() - public.rate_limits.last_request_at > (p_window_seconds || ' seconds')::interval THEN 1
            ELSE public.rate_limits.count + 1
        END,
        last_request_at = now()
    RETURNING count, last_request_at INTO v_count, v_last_request_at;

    IF v_count > p_max_requests THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke default public access to prevent DoS/bypassing via PostgREST
REVOKE EXECUTE ON FUNCTION public.check_rate_limit FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO service_role;
