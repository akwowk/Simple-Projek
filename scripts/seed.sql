
-- ================================
-- SUBJECTS
-- ================================

INSERT INTO subjects (
  id,
  name,
  lecturer,
  color
) VALUES
(
  'subject-001',
  'Jaringan Komputer',
  'Dosen Jaringan',
  '#3b82f6'
),
(
  'subject-002',
  'Pemrograman Web',
  'Dosen Pemrograman',
  '#16a34a'
),
(
  'subject-003',
  'Metode Penelitian',
  'Dosen Penelitian',
  '#9333ea'
)
ON CONFLICT DO NOTHING;


-- ================================
-- SCHEDULES
-- ================================

INSERT INTO schedules (
  id,
  subject_id,
  day_of_week,
  start_time,
  end_time,
  room
) VALUES
(
  'schedule-001',
  'subject-001',
  1,
  '08:00',
  '10:00',
  'Ruang 302'
),
(
  'schedule-002',
  'subject-002',
  1,
  '13:00',
  '15:00',
  'Lab Komputer'
),
(
  'schedule-003',
  'subject-003',
  3,
  '09:00',
  '11:00',
  'Ruang 201'
),
(
  'schedule-004',
  'subject-001',
  4,
  '10:00',
  '12:00',
  'Lab Jaringan'
),
(
  'schedule-005',
  'subject-002',
  5,
  '08:00',
  '10:00',
  'Lab Komputer'
)
ON CONFLICT DO NOTHING;


-- ================================
-- TASKS
-- ================================

INSERT INTO tasks (
  id,
  subject_id,
  title,
  description,
  deadline,
  priority,
  status
) VALUES
(
  'task-001',
  'subject-003',
  'Laporan penelitian AI',
  'Menyelesaikan hasil dan pembahasan.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+1 day'
  ),
  'high',
  'todo'
),
(
  'task-002',
  'subject-001',
  'Konfigurasi Inter-VLAN',
  'Praktik menggunakan Packet Tracer.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+3 days'
  ),
  'medium',
  'in_progress'
),
(
  'task-003',
  'subject-002',
  'Website sederhana',
  'Membuat website responsive.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+5 days'
  ),
  'low',
  'todo'
),
(
  'task-004',
  NULL,
  'Merapikan catatan kuliah',
  'Merapikan catatan minggu sebelumnya.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '-1 day'
  ),
  'medium',
  'done'
)
ON CONFLICT DO NOTHING;


-- ================================
-- EVENTS
-- ================================

INSERT INTO events (
  id,
  title,
  description,
  start_at,
  end_at,
  location
) VALUES
(
  'event-001',
  'Rapat kelompok',
  'Membahas tugas kelompok.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+2 days'
  ),
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+2 days',
    '+1 hour'
  ),
  'Online'
),
(
  'event-002',
  'Seminar teknologi',
  'Mengikuti seminar teknologi.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+4 days'
  ),
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '+4 days',
    '+3 hours'
  ),
  'Aula Kampus'
),
(
  'event-003',
  'Diskusi praktikum',
  'Evaluasi hasil praktikum.',
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '-2 days'
  ),
  strftime(
    '%Y-%m-%dT%H:%M:%fZ',
    'now',
    '-2 days',
    '+1 hour'
  ),
  'Ruang 302'
)
ON CONFLICT DO NOTHING;
