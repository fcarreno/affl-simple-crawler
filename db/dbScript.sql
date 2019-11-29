-- --------------------------------------------------------
-- Host:                         sql9.freemysqlhosting.net
-- Server version:               5.5.58-0ubuntu0.14.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for sql9313622
CREATE DATABASE IF NOT EXISTS `sql9313622` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `sql9313622`;

-- Dumping structure for table sql9313622.performance
CREATE TABLE IF NOT EXISTS `performance` (
  `date` varchar(50) NOT NULL,
  `commissions` varchar(50) NOT NULL,
  `sales` varchar(50) NOT NULL,
  `leads` varchar(50) NOT NULL,
  `clicks` varchar(50) NOT NULL,
  `epc` varchar(50) NOT NULL,
  `impressions` varchar(50) NOT NULL,
  `cr` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table sql9313622.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `picture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
