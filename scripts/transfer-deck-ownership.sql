-- Transfer flashcard deck ownership from old account to new account
-- Old account: 77788b1d-ea0f-4f92-868b-285bbbe55473
-- New account: 2c10f9bb-50b2-4bb6-84c8-f12426d7ba37 (girish.raj0710@gmail.com)

BEGIN;

-- Step 1: Show current deck ownership
SELECT
  fd.id,
  fd.title,
  fd.user_id as current_owner,
  u.email as owner_email
FROM flashcard_decks fd
LEFT JOIN users u ON fd.user_id = u.id
WHERE fd.user_id = '77788b1d-ea0f-4f92-868b-285bbbe55473';

-- Step 2: Transfer all decks from old account to new account
UPDATE flashcard_decks
SET user_id = '2c10f9bb-50b2-4bb6-84c8-f12426d7ba37'
WHERE user_id = '77788b1d-ea0f-4f92-868b-285bbbe55473';

-- Step 3: Verify transfer
SELECT
  fd.id,
  fd.title,
  fd.user_id as new_owner,
  u.email as owner_email
FROM flashcard_decks fd
LEFT JOIN users u ON fd.user_id = u.id
WHERE fd.user_id = '2c10f9bb-50b2-4bb6-84c8-f12426d7ba37';

COMMIT;
