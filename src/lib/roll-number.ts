import { createServerFn } from '@tanstack/react-start'

export const getNextRollNumber = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: users } = await supabaseAdmin.auth.admin.listUsers()

    let maxRoll = 3030000
    for (const u of users?.users ?? []) {
      const rn = u.user_metadata?.roll_number as string | undefined
      if (rn) {
        const num = parseInt(rn, 10)
        if (!isNaN(num) && num > maxRoll) maxRoll = num
      }
    }

    return String(maxRoll + 1)
  })
