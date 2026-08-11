import { createServerFn } from '@tanstack/react-start'
import { randomInt } from 'node:crypto'

const ROLL_MIN = 3030000
const ROLL_MAX = 3099999

export const getNextRollNumber = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 })

    const taken = new Set<number>()
    for (const u of users?.users ?? []) {
      const rn = u.user_metadata?.roll_number as string | undefined
      if (rn) {
        const num = parseInt(rn, 10)
        if (!isNaN(num)) taken.add(num)
      }
    }

    if (taken.size >= ROLL_MAX - ROLL_MIN + 1) {
      throw new Error("No available roll numbers")
    }

    let roll: number
    do {
      roll = randomInt(ROLL_MIN, ROLL_MAX + 1)
    } while (taken.has(roll))

    return String(roll)
  })
