-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2025 at 09:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `certificate_verification_qr_generator`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_user`
--

CREATE TABLE `admin_user` (
  `username` varchar(55) NOT NULL,
  `password` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_user`
--

INSERT INTO `admin_user` (`username`, `password`) VALUES
('DICTRegion1ILCDB', 'd!Ct#R1_2025@ILCDB');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `certificate_code` varchar(255) NOT NULL,
  `hash_code` varchar(255) NOT NULL,
  `qr_image_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `firstname`, `middlename`, `lastname`, `course`, `serial_number`, `organization`, `venue`, `date`, `certificate_code`, `hash_code`, `qr_image_path`, `created_at`) VALUES
(19, 'Hannah', 'Magada', 'Roa', 'BRAMS', '3423-ASFFG', 'PSU Urdaneta', 'La Union', '2025-02-18', 'ILCDB_R1_Hannah-Magada-Roa-BRAMS-3423-ASFFG-PSU Urdaneta-La Union-February 18, 2025', '2d65139377c91fbffe4175b0865202587e2d922c3edc608fc23a0f54bc10f6d18386bb9c9d3e500f9fedc9a38eb573b536cca61994e1df576e6f78f1a1cc45594cd3a468a6c4748adb73e3067cc717c179ef443a29f00aa073096f5989e25d89ab9ad85cc909ccaf3011776300fdb96f3473cd8612efac9cff2c40ac5fcd82d', 'ILCDB_R1_Hannah-Magada-Roa-BRAMS-3423-ASFFG-PSU Urdaneta-La Union-February 18, 2025.png', '2025-02-18 00:57:47'),
(21, 'Christian Gleen', '', 'Villanueva', 'BRAMS', '0115-BDSF', 'PSU Lingayen', 'La Union', '2025-02-20', 'ILCDB_R1_Christian Gleen--Villanueva-BRAMS-0115-BDSF-PSU Lingayen-La Union-February 20, 2025', 'b212c1767b071cd97251173354bd86940fc7be1e4807079d73a883ad3f2675a514e27c522af09440e82fb52afae834f36ceeb81ad26a71b5a2e0dfee001c5da75c5ba84fc6cb0f71b568bf9adb27ad1772e2553ac3e71ba1f38748134fb46fdcc853f228c92482fccdfe87c36b82bf6e1d962512b301ed8e084005fcfa23bb6', 'ILCDB_R1_Christian Gleen--Villanueva-BRAMS-0115-BDSF-PSU Lingayen-La Union-February 20, 2025.png', '2025-02-20 00:45:04'),
(22, 'Christian Kaide', '', 'Cendana', 'BRAMS', '0115-CKC', 'PSU Urdaneta', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Christian Kaide__Cendana-BRAMS-0115-CKC-PSU Urdaneta-La Union-February 19, 2025', 'bf464bc24bddbcb7ea8da2e730745953af118f5b4279e1b8dc3282c08727ad83757043d4bb9f742134d9f551af2333857304779402afb9596822d908fc0e18d08c191ee314fb72a96f26afc5e08a5f329f3cff4d9d2a5fe5f0a3865118627c866e5ced648c137b7c8d563d8427d5fee41f2e6ad4a03707593c3e40b1af3208b', 'DICT_ILCDB_R1-Christian Kaide__Cendana-BRAMS-0115-CKC-PSU Urdaneta-La Union-February 19, 2025.png', '2025-02-20 01:02:55'),
(23, 'Darwin', 'James', 'Ciano', 'BRAMS', '3423-DJC', 'PSU Lingayen', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Darwin_James_Ciano-BRAMS-3423-DJC-PSU Lingayen-La Union-February 19, 2025', '55209232facb98452fe88560b6b178141df801a0ee0daf736796de48f93599d0f74d19a62bedc9b580b7f54d8f79f1ee1bb45e34140c2b744e35b9306204f53880af285aea6192ad053a69cfe61b29a0912598082b400b77fcf839d7d76f687c3c52287bf9b0027e0e4237829984a0dbba5e8a08438065058da6f7daf71382b', 'DICT_ILCDB_R1-Darwin_James_Ciano-BRAMS-3423-DJC-PSU Lingayen-La Union-February 19, 2025.png', '2025-02-20 01:03:58'),
(24, 'John', '', 'David', 'BRAMS', '3424DAJ', 'LNU', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-John__David-BRAMS-3424DAJ-LNU-La Union-February 19, 2025', 'ec492a3d49916f81208dd43c09a5b8c734526907987eebece10880ec15efb50cde3a403e74324b9b37f2d5390159c545976d4e954846b5b1387f2783e37f0a9eea44f8a9d4cc90a3dbe98903a435c6cf23a24f305297962a698e40010de30d78b60b2f64920864c09ac99a338c06f07cdf1f2b106220698ccc3fe679279d8d6', 'DICT_ILCDB_R1-John__David-BRAMS-3424DAJ-LNU-La Union-February 19, 2025.png', '2025-02-20 01:05:59'),
(25, 'Ericson', 'Magallanes', 'Olchondra', 'BRAMS', '3463EMOL', 'PSU Lingayen', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Ericson_Magallanes_Olchondra-BRAMS-3463EMOL-PSU Lingayen-La Union-February 19, 2025', '2d31c860620b2fc12b96f8e2a54211dc1e1096e415e20b6f0505c9859fe86471fe05cf757ab3bef8f2eaa6bb86802ab4be6e3125d1e991b3707a0980acfe45967cfc75d17c0eb834108a2f093f90fd5f82736e550013b39a09c4c1b8df6cbce7c5e64159048c20d7eae12358a506c2c88a232c56888e9feae31f10c05cac852', 'DICT_ILCDB_R1-Ericson_Magallanes_Olchondra-BRAMS-3463EMOL-PSU Lingayen-La Union-February 19, 2025.png', '2025-02-20 01:07:44'),
(26, 'Jerico', '', 'Peralta', 'BRAMS', '4536JPEE', 'LNU', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Jerico__Peralta-BRAMS-4536JPEE-LNU-La Union-February 19, 2025', 'e6f78480d28cca690aa5f3950f5e280178f86450f16684e889eee65cbd87752cff87028e0b1984b4ee910ee350cfdfdf16d55813d5940ae98a2ddc42e858d5e624451f758460e08a2deb5bc0095994b1dac31d7063a6422661f6e5234637f763d4efa17860ab571168accc6e3f229a5694c3684b9a2232afa0bd48bd4bf40d9', 'DICT_ILCDB_R1-Jerico__Peralta-BRAMS-4536JPEE-LNU-La Union-February 19, 2025.png', '2025-02-20 01:09:39'),
(27, 'Jerico', '', 'Garcia', 'BRAMS', '4523JRC', 'PSU Urdaneta', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Jerico__Garcia-BRAMS-4523JRC-PSU Urdaneta-La Union-February 19, 2025', 'a9210a189ccb6c793daa00ebe211f1469caf996c4a883e6080356c1ebff8ab8751d29a9d2d9c343bd3072c7ee95bdb5f2fa0b8d48250936ad45045def36c32d3d133768bfceed3f727a2ea98752dcccda8d67f15e5edf8550e8208ed73d072002c24fcacd84be2b3dadfae8422b0c5ea623101f8fcdc311759f56835974ce03', 'DICT_ILCDB_R1-Jerico__Garcia-BRAMS-4523JRC-PSU Urdaneta-La Union-February 19, 2025.png', '2025-02-20 01:12:04'),
(28, 'Jordan', '', 'Pasana', 'BRAMS', '5435-JRP', 'PSU Lingayen', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Jordan__Pasana-BRAMS-5435-JRP-PSU Lingayen-La Union-February 19, 2025', 'f41c52fec00261c69519be380c80740b382f648c366b88d4d25b2f10baf540a19fd6a9cb6ec74b5a1eca9b58bde14a42368f8ed0852c8b453a6518397ca6ec574974e4efcbd28c366ccd25a477483401055b3c42fea0c088751b8f4fcdd0cc90145203f1c63e49cddf3013fd0afb7f999c008e8229781c0f5b0bcae8c3013b7', 'DICT_ILCDB_R1-Jordan__Pasana-BRAMS-5435-JRP-PSU Lingayen-La Union-February 19, 2025.png', '2025-02-20 01:13:35'),
(29, 'Vincent Ivan', '', 'Iglesias', 'BRAMS', '0324-FSDFG', 'LNU', 'La Union', '2025-02-19', 'DICT_ILCDB_R1-Vincent Ivan__Iglesias-BRAMS-0324-FSDFG-LNU-La Union-February 19, 2025', '69348d4402f8d1ad38375da0c1ae60554a0e346a41f0c001855d015f84520523558ce63d8c01676bc20993546ac494eaadc66642a2fb58429e9c6a00d3ec42480401cb71d28f0bb15e12ff62cd79e7ac84c3402e1ad1d16ab4141f8a55843eb6abcbb4394445584af99d360aed3bdc9e8fe726b8a7b8edf88ac9c6ac2cd72d7', 'DICT_ILCDB_R1-Vincent Ivan__Iglesias-BRAMS-0324-FSDFG-LNU-La Union-February 19, 2025.png', '2025-02-20 01:14:42');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course`) VALUES
(1, 'BRAMS'),
(2, 'Productivity Tools (PT)'),
(3, 'Advance MS Excel'),
(4, 'Advance MS Word'),
(5, 'MS Publisher'),
(6, 'Web Design (WD)'),
(7, 'Web Development (WsD)'),
(8, 'Basic Programming Using Java (BPJ)'),
(9, 'Social Media Marketing (SocMed)'),
(10, 'Cybersecurity Awareness (CA)'),
(11, 'Java Programming (JP)'),
(12, 'Graphic Design (GD)'),
(13, 'Javascript Programming (JP)'),
(14, 'HTML5 and CSS Basics'),
(15, 'Google Apps');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
