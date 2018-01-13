DROP DATABASE IF EXISTS musical_slides;

CREATE DATABASE musical_slides;

USE musical_slides;

CREATE TABLE musicInfo (
  id int NOT NULL AUTO_INCREMENT,
  userName varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

