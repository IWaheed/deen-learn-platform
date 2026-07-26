import { createServerFn } from '@tanstack/react-start'

export const getNextRollNumber = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data, error } = await supabaseAdmin.rpc('next_roll_number')
    if (error) throw error
    return data as string
  })
