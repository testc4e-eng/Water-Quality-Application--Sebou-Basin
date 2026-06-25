ALTER TABLE data_admin.change_request
    ADD COLUMN IF NOT EXISTS rollback_available boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS rollback_status text NOT NULL DEFAULT 'NOT_PREPARED',
    ADD COLUMN IF NOT EXISTS rollback_reference jsonb,
    ADD COLUMN IF NOT EXISTS rollback_requested_by text,
    ADD COLUMN IF NOT EXISTS rollback_requested_at timestamp without time zone,
    ADD COLUMN IF NOT EXISTS rollback_approved_by text,
    ADD COLUMN IF NOT EXISTS rollback_approved_at timestamp without time zone,
    ADD COLUMN IF NOT EXISTS rollback_applied_by text,
    ADD COLUMN IF NOT EXISTS rollback_applied_at timestamp without time zone;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'change_request_rollback_status_chk'
    ) THEN
        ALTER TABLE data_admin.change_request
            ADD CONSTRAINT change_request_rollback_status_chk
            CHECK (
                rollback_status IN (
                    'NOT_PREPARED',
                    'READY',
                    'REQUESTED',
                    'APPROVED',
                    'APPLIED',
                    'FAILED'
                )
            );
    END IF;
END $$;
