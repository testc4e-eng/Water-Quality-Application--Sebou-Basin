import psycopg2

# Connection info from .env manually extracted
conn = psycopg2.connect(
    host="127.0.0.1",
    port="5432",
    database="abh_sad",
    user="postgres",
    password="c4e@test@2025"
)

cur = conn.cursor()

try:
    print("Creating security.activity_logs table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS "security"."activity_logs" (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER,
            "username" VARCHAR(255),
            "method" VARCHAR(10) NOT NULL,
            "path" VARCHAR(255) NOT NULL,
            "status_code" INTEGER NOT NULL,
            "duration_ms" INTEGER NOT NULL,
            "ip_address" VARCHAR(64),
            "user_agent" TEXT,
            "query_params" TEXT,
            "request_payload" TEXT,
            "created_at" TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_id" ON "security"."activity_logs" ("user_id");
        CREATE INDEX IF NOT EXISTS "idx_activity_logs_created_at" ON "security"."activity_logs" ("created_at");
        CREATE INDEX IF NOT EXISTS "idx_activity_logs_username" ON "security"."activity_logs" ("username");
    """)
    conn.commit()
    print("Table created successfully!")
except Exception as e:
    print(f"Error creating table: {e}")
    conn.rollback()
finally:
    cur.close()
    conn.close()
