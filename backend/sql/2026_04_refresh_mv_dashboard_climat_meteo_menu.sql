-- Refresh job script for analytics.mv_dashboard_climat_meteo_menu
-- Usage (scheduled): psql -d abh_sad -f 2026_04_refresh_mv_dashboard_climat_meteo_menu.sql

REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.mv_dashboard_climat_meteo_menu;
ANALYZE analytics.mv_dashboard_climat_meteo_menu;

