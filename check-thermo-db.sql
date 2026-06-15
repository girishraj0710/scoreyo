SELECT 
  topic_id, 
  title,
  LENGTH(content::text) as content_length,
  (content->'sections')::jsonb IS NOT NULL as has_sections,
  jsonb_array_length((content->'sections')::jsonb) as section_count
FROM topic_study_content 
WHERE topic_id = 'thermodynamics';
