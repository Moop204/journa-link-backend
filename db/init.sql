DROP TABLE IF EXISTS Reporter CASCADE;
DROP TABLE IF EXISTS Publisher CASCADE;
DROP TABLE IF EXISTS Article CASCADE;
DROP TABLE IF EXISTS ReportedOn CASCADE;

CREATE TABLE Reporter (
  id integer PRIMARY KEY, 
  name varchar(128) 
);

CREATE TABLE Publisher (
  id integer PRIMARY KEY, 
  link varchar(128), 
  name varchar(128)
);
CREATE TABLE Article (
  id integer PRIMARY KEY, 
  title varchar(64), 
  link varchar(128),
  publisher integer, 
  FOREIGN KEY (publisher) REFERENCES Publisher(id)  
);

CREATE TABLE ReportedOn (
  id integer,
  reporter integer, FOREIGN KEY(Reporter) REFERENCES Reporter(id), 
  article integer, FOREIGN KEY(Article) REFERENCES Article(id)
);

insert into Reporter values (1, 'Jim Brewer');
insert into Reporter values (2, 'Scott Davis');

INSERT INTO Publisher VALUES (1, 'wkrb13.com', 'wkrb13');

INSERT INTO Article VALUES (1, 'XSGD Trading Up 0.2% Over Last 7 Days (XSGD)', 'www.google.com', 1);
INSERT INTO ReportedOn VALUES (1, 1, 1);