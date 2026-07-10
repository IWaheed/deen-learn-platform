-- Seed: شرح أحاديث الفتن والحوادث
-- Paste this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- or run: npx supabase db push --include-seed

DO $$
DECLARE
  course_id UUID;
BEGIN
  -- Insert the course
  INSERT INTO public.courses (title, slug, description, cover_url, is_published)
  VALUES (
    'شرح أحاديث الفتن والحوادث',
    'sharh-ahadith-al-fitan-wal-hawadith',
    'شرح أحاديث الفتن والحوادث للشيخ المجدد محمد بن عبدالوهاب – دورة ألقاها الاستاذ إرتضىٰ وحيد (وفقه الله) باللغة الأردية.
An explanation of the aḥādīth on trials and tribulations (al-fitan wa al-ḥawādith) by the reviver Sheikh Muḥammad ibn ʿAbd al-Wahhāb, taught in Urdu by Ustādh Irtaza Waheed.',
    'https://i.ytimg.com/vi/6kRQvshR_mk/hqdefault.jpg',
    true
  )
  RETURNING id INTO course_id;

  -- Insert lectures
  INSERT INTO public.lectures (course_id, title, youtube_url, position) VALUES
    (course_id, 'مجلس 1 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=6kRQvshR_mk', 1),
    (course_id, 'مجلس 2 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=oZ91Ocyt4Q4', 2),
    (course_id, 'مجلس 3 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=rsSmPZbqrxk', 3),
    (course_id, 'مجلس 4 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=1-6SaJW4rBQ', 4),
    (course_id, 'مجلس 5 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=9JOahUl3UAI', 5),
    (course_id, 'مجلس 6 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=NtwovZ5f9N8', 6),
    (course_id, 'مجلس 7 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=dJKkyhXmA-w', 7),
    (course_id, 'مجلس 8 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=x5hmk56jrk8', 8),
    (course_id, 'مجلس 9 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=gulmBjNAVEo', 9),
    (course_id, 'مجلس 10 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=kIy9l1f-Tis', 10),
    (course_id, 'مجلس 11 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=AIV-0up3Qx8', 11),
    (course_id, 'مجلس 12 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=ZJPLgCWtW4I', 12),
    (course_id, 'مجلس 13 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=kp2KxYFoZXc', 13),
    (course_id, 'مجلس 14 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=-E1F6P4iaw4', 14),
    (course_id, 'مجلس 15 – شرح أحاديث الفتن والحوادث', 'https://www.youtube.com/watch?v=EpkZIs927LE', 15);

  RAISE NOTICE 'Created course with id: %', course_id;

  -- Course 2: Mafateeh al Talab
  INSERT INTO public.courses (title, slug, description, cover_url, is_published)
  VALUES (
    'Mafateeh al Talab',
    'mafateeh-al-talab',
    'Mafateeh al-Talab (مفاتيح الطلب) — Keys to Seeking Knowledge, taught by Ustadh Irtaza Waheed.',
    'https://i.ytimg.com/vi/-Zc8qaORtcc/hqdefault.jpg',
    true
  )
  RETURNING id INTO course_id;

  INSERT INTO public.lectures (course_id, title, youtube_url, position) VALUES
    (course_id, 'Class 1 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=-Zc8qaORtcc', 1),
    (course_id, 'Class 2 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=3ioUugIQ9nk', 2),
    (course_id, 'Class 3 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=i-naUq2ESbY', 3),
    (course_id, 'Class 4 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=cCCEJQWrtx0', 4),
    (course_id, 'Class 5 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=SG_3YZvPHoM', 5),
    (course_id, 'Class 6 | Mafateeh Al Talab', 'https://www.youtube.com/watch?v=21NSrduV5_o', 6);

  RAISE NOTICE 'Created course with id: %', course_id;
END $$;
