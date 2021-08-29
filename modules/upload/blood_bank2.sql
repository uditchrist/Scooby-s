-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2021 at 11:16 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blood_bank2`
--

-- --------------------------------------------------------

--
-- Table structure for table `bloodgroup`
--

CREATE TABLE `bloodgroup` (
  `id` int(11) NOT NULL,
  `BloodGroup` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bloodgroup`
--

INSERT INTO `bloodgroup` (`id`, `BloodGroup`) VALUES
(1, 'A'),
(2, 'A+'),
(3, 'B+'),
(4, 'B-'),
(5, 'O+'),
(6, 'O-'),
(7, 'AB+'),
(8, 'AB-');

-- --------------------------------------------------------

--
-- Table structure for table `blood_contact`
--

CREATE TABLE `blood_contact` (
  `blood_contact_id` int(100) NOT NULL,
  `contact_fk` int(100) DEFAULT NULL,
  `blood_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `blood_donor_group`
--

CREATE TABLE `blood_donor_group` (
  `blood_donor_group_id` int(100) NOT NULL,
  `donor_fk` int(100) DEFAULT NULL,
  `blood_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `blood_group`
--

CREATE TABLE `blood_group` (
  `blood_id` int(100) NOT NULL,
  `blood_group` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blood_group`
--

INSERT INTO `blood_group` (`blood_id`, `blood_group`) VALUES
(3, 'sd'),
(5, 'D#');

-- --------------------------------------------------------

--
-- Table structure for table `blood_request_group`
--

CREATE TABLE `blood_request_group` (
  `blood_request_group_id` int(100) NOT NULL,
  `requester_fk` int(100) DEFAULT NULL,
  `blood_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `city_id` int(100) NOT NULL,
  `city_code` varchar(100) DEFAULT NULL,
  `city_name` varchar(100) DEFAULT NULL,
  `description` varchar(120) DEFAULT NULL,
  `donor_fk` int(100) DEFAULT NULL,
  `requester_fk` int(100) DEFAULT NULL,
  `state_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`city_id`, `city_code`, `city_name`, `description`, `donor_fk`, `requester_fk`, `state_fk`) VALUES
(3, 'CLSs', 'Thihariyass', 'Thiahriya town shop', NULL, NULL, 36);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contact_id` int(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `member_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Table structure for table `email_subs`
--

CREATE TABLE `email_subs` (
  `subscribe_id` int(100) NOT NULL,
  `email` varchar(160) DEFAULT NULL,
  `member_fk` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(16, 'Udit Gupta', 'udit_admin', '21232f297a57a5a743894a0e4a801fc3', 'udit@gmail.com', NULL, NULL, 'admin', 'upload/user5_1620571608.png'),
(17, 'Cris Dutt', 'cris_admin', '11330b49aa47c4567bb8033f118500c8', 'cris@gmail.com', 2147483647, 'Udaipur', 'admin', 'upload/user2_1620571419.png');

-- --------------------------------------------------------

--
-- Table structure for table `requester2`
--

CREATE TABLE `requester2` (
  `did` int(11) NOT NULL,
  `requester_id` int(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Father_Name` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Mobile` bigint(100) DEFAULT NULL,
  `Blood_Group` varchar(100) DEFAULT NULL,
  `Gender` varchar(100) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Weight` int(11) DEFAULT NULL,
  `City` varchar(200) DEFAULT NULL,
  `Pin_Code` int(11) DEFAULT NULL,
  `Name_of_Donor` varchar(200) DEFAULT NULL,
  `Donor_ID` int(100) DEFAULT NULL,
  `Quantity` int(11) NOT NULL,
  `Hospital` varchar(50) NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `requester2`
--

INSERT INTO `requester2` (`did`, `requester_id`, `Name`, `Father_Name`, `Email`, `Mobile`, `Blood_Group`, `Gender`, `DOB`, `Weight`, `City`, `Pin_Code`, `Name_of_Donor`, `Donor_ID`, `Quantity`, `Hospital`, `image`, `status`) VALUES
(3, 101, 'Rakshita', 'abcd', 'rakshita@gmail.com', 7894561234, 'O+', 'Female', '1999-11-11', 50, 'Bangalore', 313564, 'Udit Gupta', 100, 1, 'Fortis', '2047262 IOT MOCK TEST 1.pdf', 1),
(4, 102, 'Cris Dutt', 'abcd', 'cris@gmail.com', 9876532154, 'A+', 'Male', '1998-11-11', 75, 'Bangalore', 564987, 'Udit Gupta', 100, 5, 'Fortis', '2047262 IOT MOCK TEST 1.pdf', 0),
(5, 100, 'Udit Gupta', 'D K Gupta', 'udit.ukg@gmail.com', 7891492201, 'B+', 'Male', '1998-09-11', 75, 'Udaipur', 313001, 'Cris Dutt', 102, 2, 'AIMS', '2047262 IOT MOCK TEST 1.pdf', 0),
(7, 101, 'Rakshita', 'abcd', 'rakshita@gmail.com', 7894561234, 'O+', 'Female', '1999-11-11', 50, 'Bangalore', 313564, 'Rohan', 105, 5, 'AIMS', '2047262 IOT MOCK TEST 1.pdf', 0),
(8, 101, 'Rakshita', 'abcd', 'rakshita@gmail.com', 7894561234, 'O+', 'Female', '1999-11-11', 50, 'Bangalore', 313564, 'Cris Dutt', 102, 8, 'Fortis', '2047262 IOT MOCK TEST 1.pdf', 1),
(9, 102, 'Cris Dutt', 'abcd', 'cris@gmail.com', 9876532154, 'A+', 'Male', '1998-11-11', 75, 'Bangalore', 564987, 'Rohan', 105, 2, 'Fortis', '2047262 IOT MOCK TEST 1.pdf', 1),
(10, 102, 'Cris Dutt', 'abcd', 'cris@gmail.com', 9876532154, 'A+', 'Male', '1998-11-11', 75, 'Bangalore', 564987, 'Udit Gupta', 100, 2, 'Fortis', '2047262 IOT MOCK TEST 1.pdf', 0);

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `state_id` int(100) NOT NULL,
  `state_code` varchar(100) DEFAULT NULL,
  `state_name` varchar(100) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`state_id`, `state_code`, `state_name`, `description`) VALUES
(36, '84603', 'Kandyd', 'New data been added'),
(37, 'CLM', 'Western', 'Province');

-- --------------------------------------------------------

--
-- Table structure for table `userquery`
--

CREATE TABLE `userquery` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `EmailId` varchar(120) DEFAULT NULL,
  `ContactNumber` char(11) DEFAULT NULL,
  `Message` longtext DEFAULT NULL,
  `PostingDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userquery`
--

INSERT INTO `userquery` (`id`, `name`, `EmailId`, `ContactNumber`, `Message`, `PostingDate`, `status`) VALUES
(7, 'Cris Dutt', 'cris@gmail.com', '7894561234', 'TESTING2', '2021-05-11 09:22:23', 0),
(8, 'Rakshita', 'rakshita@gmail.com', '7891492201', 'TESTING', '2021-05-11 09:40:29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `userreg`
--

CREATE TABLE `userreg` (
  `user_ID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Father_Name` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Mobile` bigint(20) NOT NULL,
  `Blood_Group` varchar(50) NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `DOB` date NOT NULL,
  `Weight` text NOT NULL,
  `Address` text NOT NULL,
  `Pin_Code` int(11) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `C_Password` varchar(50) NOT NULL,
  `usertype` text NOT NULL,
  `id_proof` varchar(100) NOT NULL,
  `donor_status` int(11) NOT NULL,
  `admin_approval` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userreg`
--

INSERT INTO `userreg` (`user_ID`, `Name`, `Father_Name`, `Email`, `Mobile`, `Blood_Group`, `Gender`, `DOB`, `Weight`, `Address`, `Pin_Code`, `Password`, `C_Password`, `usertype`, `id_proof`, `donor_status`, `admin_approval`) VALUES
(100, 'Udit Gupta', 'D K Gupta', 'udit.ukg@gmail.com', 7891492201, 'B+', 'Male', '1998-09-11', '75', 'Udaipur', 313001, '73615a1fa78df860a140636ad21fcf84', '73615a1fa78df860a140636ad21fcf84', 'user', '2047262_CN.pdf', 1, 2),
(101, 'Rakshita', 'abcd', 'rakshita@gmail.com', 7894561234, 'O+', 'Female', '1999-11-11', '50', 'Bangalore', 313564, '2ff08d2b6a681bd6d2baa5c511c236fa', '2ff08d2b6a681bd6d2baa5c511c236fa', 'user', '2047262_CN.pdf', 1, 2),
(102, 'Cris Dutt', 'abcd', 'cris@gmail.com', 9876532154, 'A+', 'Male', '1998-11-11', '75', 'Bangalore', 564987, '0d22274521f9185dcd437328b983a72b', '0d22274521f9185dcd437328b983a72b', 'user', 'CN activity-2047261.pdf', 1, 2),
(103, 'Ishank Gupta', 'D K Gupta', 'ishank@gmail.com', 9045809945, 'B+', 'Male', '1994-05-11', '75', 'Aligarh', 564987, '1a92a5f793ea6da649b4fc3a0e54d39e', '1a92a5f793ea6da649b4fc3a0e54d39e', 'user', '1726 Vishal Ranjan.pdf', 0, 0),
(104, 'Ishank', 'DKg', 'ishank@gmail.com', 7894561234, 'B+', 'Male', '1994-05-11', '75', 'Agra', 202001, '1a92a5f793ea6da649b4fc3a0e54d39e', '1a92a5f793ea6da649b4fc3a0e54d39e', 'user', '1726 Vishal Ranjan.pdf', 0, 0),
(105, 'Rohan', 'abc', 'rohan@gmail.com', 7894561234, 'B+', 'Male', '1998-05-12', '52', 'Delhi', 211010, 'e4d9b646b046fbe1dbcde2eb9949b60e', 'e4d9b646b046fbe1dbcde2eb9949b60e', 'user', '2047262 IOT MOCK TEST 1.pdf', 1, 2),
(106, 'Ashish', 'Pranav', 'ashish@gmail.com', 7894565122, 'O+', 'Male', '1998-11-11', '50', 'Agra', 123456, '6abc9eba853ea08dd0e97810f68194e7', '6abc9eba853ea08dd0e97810f68194e7', 'user', '2047262 IOT MOCK TEST 1.pdf', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_contact`
--
ALTER TABLE `blood_contact`
  ADD PRIMARY KEY (`blood_contact_id`),
  ADD KEY `contact_fk` (`contact_fk`),
  ADD KEY `blood_fk` (`blood_fk`);

--
-- Indexes for table `blood_donor_group`
--
ALTER TABLE `blood_donor_group`
  ADD PRIMARY KEY (`blood_donor_group_id`),
  ADD KEY `donor_fk` (`donor_fk`),
  ADD KEY `blood_fk` (`blood_fk`);

--
-- Indexes for table `blood_group`
--
ALTER TABLE `blood_group`
  ADD PRIMARY KEY (`blood_id`);

--
-- Indexes for table `blood_request_group`
--
ALTER TABLE `blood_request_group`
  ADD PRIMARY KEY (`blood_request_group_id`),
  ADD KEY `requester_fk` (`requester_fk`),
  ADD KEY `blood_fk` (`blood_fk`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`city_id`),
  ADD KEY `donor_fk` (`donor_fk`),
  ADD KEY `requester_fk` (`requester_fk`),
  ADD KEY `state_fk` (`state_fk`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `member_fk` (`member_fk`);

--
-- Indexes for table `donor`
--
ALTER TABLE `donor`
  ADD PRIMARY KEY (`donor_id`,`username_fk`),
  ADD KEY `member` (`username_fk`);

--
-- Indexes for table `email_subs`
--
ALTER TABLE `email_subs`
  ADD PRIMARY KEY (`subscribe_id`),
  ADD KEY `member_fk` (`member_fk`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`member_id`,`username`);

--
-- Indexes for table `requester2`
--
ALTER TABLE `requester2`
  ADD PRIMARY KEY (`did`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`state_id`);

--
-- Indexes for table `userquery`
--
ALTER TABLE `userquery`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood_contact`
--
ALTER TABLE `blood_contact`
  MODIFY `blood_contact_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blood_donor_group`
--
ALTER TABLE `blood_donor_group`
  MODIFY `blood_donor_group_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blood_group`
--
ALTER TABLE `blood_group`
  MODIFY `blood_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `blood_request_group`
--
ALTER TABLE `blood_request_group`
  MODIFY `blood_request_group_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `city_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `contact_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donor`
--
ALTER TABLE `donor`
  MODIFY `donor_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `email_subs`
--
ALTER TABLE `email_subs`
  MODIFY `subscribe_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `member_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `state_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blood_contact`
--
ALTER TABLE `blood_contact`
  ADD CONSTRAINT `blood_contact_ibfk_1` FOREIGN KEY (`contact_fk`) REFERENCES `contact` (`contact_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `blood_contact_ibfk_2` FOREIGN KEY (`blood_fk`) REFERENCES `blood_group` (`blood_id`) ON UPDATE CASCADE;

--
-- Constraints for table `blood_donor_group`
--
ALTER TABLE `blood_donor_group`
  ADD CONSTRAINT `blood_donor_group_ibfk_1` FOREIGN KEY (`donor_fk`) REFERENCES `donor` (`donor_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `blood_donor_group_ibfk_2` FOREIGN KEY (`blood_fk`) REFERENCES `blood_group` (`blood_id`) ON UPDATE CASCADE;

--
-- Constraints for table `blood_request_group`
--
ALTER TABLE `blood_request_group`
  ADD CONSTRAINT `blood_request_group_ibfk_1` FOREIGN KEY (`requester_fk`) REFERENCES `requester` (`requester_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `blood_request_group_ibfk_2` FOREIGN KEY (`blood_fk`) REFERENCES `blood_group` (`blood_id`) ON UPDATE CASCADE;

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`donor_fk`) REFERENCES `donor` (`donor_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `city_ibfk_2` FOREIGN KEY (`requester_fk`) REFERENCES `requester` (`requester_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `city_ibfk_3` FOREIGN KEY (`state_fk`) REFERENCES `state` (`state_id`) ON UPDATE CASCADE;

--
-- Constraints for table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`member_fk`) REFERENCES `member` (`member_id`) ON UPDATE CASCADE;

--
-- Constraints for table `email_subs`
--
ALTER TABLE `email_subs`
  ADD CONSTRAINT `email_subs_ibfk_1` FOREIGN KEY (`member_fk`) REFERENCES `member` (`member_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
