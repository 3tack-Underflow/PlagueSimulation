-- The queries and output often remain the same for production data. These indexes make the production queries more efficient.
-- test efficiency by executing query with and without index --

CREATE INDEX statusIndex on simulation_humans(status);

CREATE INDEX owner ON simulation_participation(username, is_owner);

CREATE INDEX owner ON simulation_participation(id, is_owner);

CREATE INDEX owner ON infection(plague_id);
