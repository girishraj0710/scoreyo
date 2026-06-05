-- Study Materials Table
-- Stores uploaded study materials (PDF, DOCX, PPT) from contributors
-- for review by admins and distribution to students

CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES dim_exams(id) ON DELETE RESTRICT,
  subject_id INTEGER NOT NULL REFERENCES dim_subjects(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK (char_length(title) <= 255),
  description TEXT CHECK (char_length(description) <= 500),
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'ppt')),
  file_size BIGINT NOT NULL CHECK (file_size <= 52428800),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  download_count INTEGER NOT NULL DEFAULT 0,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT CHECK (char_length(rejection_reason) <= 500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_study_materials_exam_subject_status
  ON study_materials(exam_id, subject_id, status)
  WHERE status = 'approved';

CREATE INDEX idx_study_materials_status
  ON study_materials(status)
  WHERE status IN ('pending', 'approved');

CREATE INDEX idx_study_materials_contributor
  ON study_materials(contributor_id);

CREATE INDEX idx_study_materials_created_at
  ON study_materials(created_at DESC);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_study_materials_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_study_materials_timestamp ON study_materials;
CREATE TRIGGER trigger_study_materials_timestamp
  BEFORE UPDATE ON study_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_study_materials_timestamp();
