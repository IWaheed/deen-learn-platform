import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock TanStack Start's createServerFn so we can test the handler directly
vi.mock('@tanstack/react-start', () => {
  return {
    createServerFn: () => {
      let validatorFn = (x: any) => x;
      let handlerFn = async (x: any) => x;

      const fn = async (args: any) => {
        const validated = validatorFn(args.data);
        return handlerFn({ data: validated });
      };

      fn.validator = (v: any) => {
        validatorFn = v;
        return fn;
      };

      fn.handler = (h: any) => {
        handlerFn = h;
        return fn;
      };

      return fn;
    }
  };
});

const mockGetUserById = vi.fn();
const mockUpdateUserById = vi.fn();

// Mock Supabase client
vi.mock('@/integrations/supabase/client.server', () => {
  return {
    supabaseAdmin: {
      auth: {
        admin: {
          getUserById: (...args: any[]) => mockGetUserById(...args),
          updateUserById: (...args: any[]) => mockUpdateUserById(...args),
        },
      },
    },
  };
});

import { enrollInCourse } from '../enrollment';

describe('enrollInCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validCourseSlug = 'quranic-sciences-zamzami';
  const validRollNumber = 'R123';
  const validUserId = 'user-123';

  it('throws an error if course does not require enrollment', async () => {
    await expect(
      enrollInCourse({ data: { courseSlug: 'free-course', rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('This course does not require enrollment');
  });

  it('throws an error if user is not found (error returned)', async () => {
    mockGetUserById.mockResolvedValueOnce({ data: null, error: new Error('Database error') });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('User not found');
  });

  it('throws an error if user is not found (no data returned)', async () => {
    mockGetUserById.mockResolvedValueOnce({ data: null, error: null });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('User not found');
  });

  it('throws an error if user has no roll number in metadata', async () => {
    mockGetUserById.mockResolvedValueOnce({
      data: { user: { user_metadata: {} } },
      error: null
    });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('No roll number found. Please register first.');
  });

  it('throws an error if roll number does not match account', async () => {
    mockGetUserById.mockResolvedValueOnce({
      data: { user: { user_metadata: { roll_number: 'R999' } } },
      error: null
    });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('Roll number does not match your account');
  });

  it('throws an error if already enrolled in the course', async () => {
    mockGetUserById.mockResolvedValueOnce({
      data: { user: { user_metadata: { roll_number: validRollNumber, enrolled_courses: [validCourseSlug] } } },
      error: null
    });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('Already enrolled in this course');
  });

  it('throws an error if updating user metadata fails', async () => {
    mockGetUserById.mockResolvedValueOnce({
      data: { user: { user_metadata: { roll_number: validRollNumber, enrolled_courses: [] } } },
      error: null
    });

    mockUpdateUserById.mockResolvedValueOnce({ error: new Error('Update failed') });

    await expect(
      enrollInCourse({ data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId } })
    ).rejects.toThrow('Failed to enroll');
  });

  it('successfully enrolls the user', async () => {
    mockGetUserById.mockResolvedValueOnce({
      data: { user: { user_metadata: { roll_number: validRollNumber, enrolled_courses: ['other-course'] } } },
      error: null
    });

    mockUpdateUserById.mockResolvedValueOnce({ error: null });

    const result = await enrollInCourse({
      data: { courseSlug: validCourseSlug, rollNumber: validRollNumber, userId: validUserId }
    });

    expect(result).toEqual({ success: true });

    // Verify the update call included the correct data
    expect(mockUpdateUserById).toHaveBeenCalledWith(validUserId, {
      user_metadata: {
        roll_number: validRollNumber,
        enrolled_courses: ['other-course', validCourseSlug]
      }
    });
  });
});
