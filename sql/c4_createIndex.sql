-- The queries and output often remain the same for production data. These indexes make the production queries more efficient.
-- test efficiency by executing query with and without index --

CREATE INDEX status_index on simulation_humans(status);

CREATE INDEX username_owner_index ON simulation_participation(username, is_owner);

CREATE INDEX id_owner_index ON simulation_participation(id, is_owner);

CREATE INDEX plague_id_index ON infection(plague_id);
