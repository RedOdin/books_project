CREATE TABLE IF NOT EXISTS `books` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `original_language` varchar(50) NOT NULL,
  `publication_date` date DEFAULT NULL,
  `pages_amount` smallint(5) UNSIGNED NOT NULL,
  `age_limit` varchar(3) DEFAULT NULL,
  `description` text,
  `rating` float(2,1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Books_Title` (`title`),
  KEY `IX_Books_Rating` (`rating`),
  KEY `IX_Books_Publication_Date` (`publication_date`),
  KEY `IX_Books_Title_Original_Language` (`title`,`original_language`),
  KEY `IX_Books_Original_Language_Rating` (`rating`,`original_language`),
  KEY `IX_Books_Original_Language_Publication_Date` (`publication_date`,`original_language`),
  KEY `IX_Books_Age_Limit` (`age_limit`),
  KEY `IX_Books_Original_Language` (`original_language`),
  KEY `IX_Books_Original_Language_Publication_Date_Rating` (`publication_date`,`rating`,`original_language`),
  KEY `IX_Books_Original_Language_Age_Limit` (`age_limit`,`original_language`),
  KEY `IX_Books_Original_Language_Publication_Date_Age_Limit` (`original_language`,`publication_date`,`age_limit`),
  KEY `IX_Books_Original_Language_Rating_Age_Limit` (`rating`,`age_limit`,`original_language`),
  KEY `IX_Books_Original_Language_Publication_Date_Rating_Age_Limit` (`original_language`,`publication_date`,`rating`,`age_limit`),
  KEY `IX_Books_Rating_Age_Limit` (`rating`,`age_limit`),
  KEY `IX_Books_Publication_Date_Age_Limit` (`publication_date`,`age_limit`),
  KEY `IX_Books_Publication_Date_Rating_Age_Limit` (`publication_date`,`rating`,`age_limit`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `e_mail` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_users` bigint(20) NOT NULL,
  `id_books` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX_SERIES_ACTORS` (`id_users`,`id_books`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TRIGGER IF EXISTS `TRG_Users_OnInsert`;

CREATE TRIGGER `TRG_Users_OnInsert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  SET NEW.password = md5(NEW.password);
END

DROP TRIGGER IF EXISTS `TRG_Users_OnUpdate`;

CREATE TRIGGER `TRG_Users_OnUpdate` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
  SET NEW.password = md5(NEW.password);
END

COMMIT;
