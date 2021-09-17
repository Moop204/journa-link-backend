-- DROP TABLE journalist CASCADE;
-- DROP TABLE publisher CASCADE;
-- DROP TABLE article CASCADE;
-- DROP TABLE reportedon CASCADE;
-- DROP TABLE reporter CASCADE;
-- DROP TABLE Article CASCADE;
-- DROP TABLE "Reporters" CASCADE;
-- DROP TABLE "Publishers" CASCADE;

SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE'
AND table_schema='public';

-- problem
SELECT * FROM "Reporter";

-- SELECT * FROM "Publisher";
-- SELECT * FROM "WorkFor";