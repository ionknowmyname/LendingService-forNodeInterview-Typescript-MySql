-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2022 at 10:51 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lending-service`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` varchar(50) NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `transaction_amount` float NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `sender_wallet_id` varchar(50) DEFAULT NULL,
  `receiver_wallet_id` varchar(50) DEFAULT NULL,
  `receiver_bank_account` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_type`, `transaction_amount`, `user_id`, `sender_wallet_id`, `receiver_wallet_id`, `receiver_bank_account`, `created_at`) VALUES
('158201a7-9d27-445d-b497-55c6792e1f59', 'WALLET-TO-WALLET', 500, 'a429ee94-6bdd-4f1b-ad3e-fc00a5530e11', 'a8fa95ff-d640-458f-8135-27031b382e9c', 'a69fff37-4c09-425e-8147-0f6c3b87b098', NULL, '2022-11-17 10:48:17'),
('d003f095-3016-4b9c-b859-885bae621762', 'WALLET-TO-WALLET', 500, 'a429ee94-6bdd-4f1b-ad3e-fc00a5530e11', 'a8fa95ff-d640-458f-8135-27031b382e9c', 'a69fff37-4c09-425e-8147-0f6c3b87b098', NULL, '2022-11-16 13:32:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `phone`, `password`, `created_at`) VALUES
('79c75fc7-9a36-4861-aaa9-7c616f0b4b4d', '33333@email.com', '3333333333', '$2b$10$W5DUUTN8C5IlmNg4vfhWR.rR4MNxEVKMfumUXkdwxZhZlDw95moJi', '2022-11-17 10:48:37'),
('a429ee94-6bdd-4f1b-ad3e-fc00a5530e11', '11111@email.com', '1111111111', '$2b$10$7/7HLUmLCx9RnKE1hciIpeseCu0kcUDMUrDGrbKtDnL/uhbGnM8La', '2022-11-16 13:17:32'),
('bed17f2a-e9a6-419b-804e-c6aa846451c1', '22222@email.com', '2222222222', '$2b$10$LAxWF4Tj0yipoe0S0Y2yG.z.Juk7A3YaPSzmQ6Wyp79Z/HJKNnYFK', '2022-11-16 13:18:45');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `wallet_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `balance` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`wallet_id`, `user_id`, `balance`, `created_at`) VALUES
('a69fff37-4c09-425e-8147-0f6c3b87b098', 'bed17f2a-e9a6-419b-804e-c6aa846451c1', 1000, '2022-11-16 13:19:14'),
('a8fa95ff-d640-458f-8135-27031b382e9c', 'a429ee94-6bdd-4f1b-ad3e-fc00a5530e11', 4000, '2022-11-16 13:18:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`wallet_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
