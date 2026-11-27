-- Custom SQL migration file, put your code below! --

CREATE TRIGGER schedules_no_overlap_insert
BEFORE INSERT ON schedules
FOR EACH ROW
WHEN (
  EXISTS (
    SELECT 1
    FROM schedules
    WHERE day_of_week = NEW.day_of_week
      AND start_time < NEW.end_time
      AND end_time > NEW.start_time
  )
)
BEGIN
  SELECT RAISE(ABORT, 'SCHEDULE_CONFLICT');
END;
--> statement-breakpoint
CREATE TRIGGER schedules_no_overlap_update
BEFORE UPDATE OF day_of_week, start_time, end_time ON schedules
FOR EACH ROW
WHEN (
  EXISTS (
    SELECT 1
    FROM schedules
    WHERE id <> OLD.id
      AND day_of_week = NEW.day_of_week
      AND start_time < NEW.end_time
      AND end_time > NEW.start_time
  )
)
BEGIN
  SELECT RAISE(ABORT, 'SCHEDULE_CONFLICT');
END;