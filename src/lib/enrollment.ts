import { createServerFn } from '@tanstack/react-start'

export const enrollInCourse = createServerFn({ method: 'POST' })
  .validator((input: { courseId: string; rollNumber: string; userId: string }) => input)
  .handler(async ({ data: { courseId, rollNumber, userId } }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('requires_enrollment')
      .eq('id', courseId)
      .single()
    if (courseError || !course) throw new Error('Course not found')
    if (!course.requires_enrollment) throw new Error('This course does not require enrollment')

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('roll_number')
      .eq('id', userId)
      .single()
    if (profileError || !profile) throw new Error('Profile not found')
    if (profile.roll_number !== rollNumber) throw new Error('Roll number does not match your account')

    const { data: existing } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .maybeSingle()
    if (existing) throw new Error('Already enrolled in this course')

    const { error: enrollError } = await supabaseAdmin
      .from('course_enrollments')
      .insert({ course_id: courseId, user_id: userId })
    if (enrollError) throw new Error('Failed to enroll')

    return { success: true }
  })

export const checkEnrollment = createServerFn({ method: 'GET' })
  .validator((input: { courseId: string; userId: string }) => input)
  .handler(async ({ data: { courseId, userId } }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .maybeSingle()

    return { enrolled: !!data }
  })
