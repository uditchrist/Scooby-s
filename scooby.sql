-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2021 at 06:13 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scooby`
--

-- --------------------------------------------------------

--
-- Table structure for table `donor`
--

CREATE TABLE `donor` (
  `donor_id` int(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `dob` varchar(100) DEFAULT NULL,
  `body_weight` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `blood_group` varchar(40) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `pincode` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `username_fk` varchar(100) NOT NULL,
  `status` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `donor`
--

INSERT INTO `donor` (`donor_id`, `name`, `father_name`, `gender`, `dob`, `body_weight`, `email`, `blood_group`, `state`, `city`, `address`, `pincode`, `phone`, `image`, `username_fk`, `status`) VALUES
(11, 'Shar', 'Ahammed', 'male', '03/08/2018', '34Kg', 'admin@gmail.com', 'O+', 'Kandyd', 'Thihariyass', '34#', '0778650336', 'Kandy', 'upload/11_1521639011.jpg', 'codeprojects', 1),
(13, 'nizam', 'nizam', 'male', '03/26/2018', '34Kg', 'codeprojects@gmail.com', 'B+', 'Kandyd', 'Thihariyass', '34#', '778650336', 'cxczxcxvxcvc', 'upload/394839_1521640578.jpg', 'super admin', 1),
(15, 'Today', 'Today', 'female', '03/14/2018', '134kg', 'today@gmail.com', 'AB+', 'Kandyd', 'Thihariyass', '4567', '0778665443', 'Amapara', 'upload/hire-php-developer-mumbai-india-ezeelive-technologies_1521645495.png', 'today', 1),
(17, 'Thursday', 'Thursday', 'male', '03/22/2018', '100Kg', 'Thursday@gmail.com', 'A+', 'Kandyd', 'Thihariyass', 'TH78', '778650336', 'ThursdayThursday', 'upload/Asian_Games_logo.svg_1521689309.png', 'super admin', 1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `member_id` int(100) NOT NULL,
  `name` varchar(190) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` int(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `usertype` varchar(100) DEFAULT NULL,
  `profile` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`member_id`, `name`, `username`, `password`, `email`, `phone`, `address`, `usertype`, `profile`) VALUES
(16, 'Udit Gupta', 'udit_admin', 'udit@123', 'udit@gmail.com', NULL, NULL, 'admin', 'upload/user5_1620571608.png');

-- --------------------------------------------------------

--
-- Table structure for table `requester`
--

CREATE TABLE `requester` (
  `did` int(11) NOT NULL,
  `requester_id` int(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Mobile` bigint(100) DEFAULT NULL,
  `Gender` varchar(100) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Address` varchar(100) NOT NULL,
  `State` varchar(50) NOT NULL,
  `City` varchar(200) DEFAULT NULL,
  `Pin_Code` int(11) DEFAULT NULL,
  `Name_of_Veterinary` varchar(200) DEFAULT NULL,
  `Donor_ID` int(100) DEFAULT NULL,
  `Description` varchar(500) NOT NULL,
  `Dog_Breed` varchar(50) NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `requester`
--

INSERT INTO `requester` (`did`, `requester_id`, `Name`, `Email`, `Mobile`, `Gender`, `DOB`, `Address`, `State`, `City`, `Pin_Code`, `Name_of_Veterinary`, `Donor_ID`, `Description`, `Dog_Breed`, `image`, `status`) VALUES
(1, 3, 'Jobin Raji', 'jobin2@gmail.com', 45612378981, 'Male', '1998-05-11', 'Avas Vikas Colony', 'Karnataka', 'Bangalore', 313001, 'Anwesha Veterinary', 1, 'My palkdjaskl', 'DOG', 'userquery.php', 1),
(2, 2, 'Jobin Reji', 'jobin@gmail.com', 9876543212, 'Male', '1998-05-11', 'F28 Subhash Nagar', 'Karnataka', 'Bangalore', 530067, 'Udit vet', 4, 'fhdfgg', 'BullDog', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `userreg`
--

CREATE TABLE `userreg` (
  `user_ID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Mobile` bigint(20) NOT NULL,
  `ACC_TYPE` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `DOB` date NOT NULL,
  `Address` text NOT NULL,
  `State` varchar(50) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Pin_Code` int(11) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `C_Password` varchar(50) NOT NULL,
  `id_proof` varchar(100) NOT NULL,
  `donor_status` int(11) NOT NULL,
  `admin_approval` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userreg`
--

INSERT INTO `userreg` (`user_ID`, `Name`, `Email`, `Mobile`, `ACC_TYPE`, `Gender`, `DOB`, `Address`, `State`, `City`, `Pin_Code`, `Password`, `C_Password`, `id_proof`, `donor_status`, `admin_approval`) VALUES
(1, 'Anwesha Veterinary', 'anwesha@gmail.com', 7891492201, 'Veterinaries', 'Female', '1999-06-16', '100 Feet Road', 'Karnataka', 'Bangalore', 530067, 'ceec2a6bc6cb2451eb6d678cdd604b65', 'ceec2a6bc6cb2451eb6d678cdd604b65', 'index.php', 1, 1),
(2, 'Jobin Reji', 'jobin@gmail.com', 9876543212, 'User', 'Male', '1998-05-11', 'F28 Subhash Nagar', 'Karnataka', 'Bangalore', 530067, '3e698ec62ae308b57b2c7133d3466c77', '3e698ec62ae308b57b2c7133d3466c77', 'index.php', 0, 0),
(3, 'Jobin Raji', 'jobin2@gmail.com', 45612378981, 'User', 'Male', '1998-05-11', 'Avas Vikas Colony', 'Karnataka', 'Bangalore', 313001, '3e698ec62ae308b57b2c7133d3466c77', '3e698ec62ae308b57b2c7133d3466c77', 'userquery.php', 0, 0),
(4, 'Udit vet', 'uditvet@gmail.com', 7891492201, 'Veterinaries', 'Male', '1998-09-11', 'Udai Apartment', 'Rajasthan', 'Udaipur', 313001, '073db74214fbc5dfbb972a2803b61e68', '073db74214fbc5dfbb972a2803b61e68', 'blood_bank2.sql', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `donor`
--
ALTER TABLE `donor`
  ADD PRIMARY KEY (`donor_id`,`username_fk`),
  ADD KEY `member` (`username_fk`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`member_id`,`username`);

--
-- Indexes for table `requester`
--
ALTER TABLE `requester`
  ADD PRIMARY KEY (`did`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donor`
--
ALTER TABLE `donor`
  MODIFY `donor_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `member_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
