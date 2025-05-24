-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 09:42 AM
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
-- Database: `facebook_clone`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL,
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`) VALUES
(1, 3, 1, 'đây là post test', '2025-03-17 04:22:19'),
(2, 4, 1, 'It\'s so Beautyfull', '2025-03-17 04:23:08'),
(3, 4, 1, 'Nice picture!!!', '2025-03-17 16:32:32'),
(4, 3, 1, 'Post test đầu tiên!', '2025-03-19 14:53:52'),
(5, 4, 2, 'This is nature!!', '2025-03-19 15:25:49'),
(6, 7, 3, 'beatyfull!!', '2025-04-23 06:54:19'),
(7, 7, 3, 'that\'s him when he was corrupted', '2025-05-21 13:02:25'),
(8, 3, 1, 'wow', '2025-05-21 13:14:44'),
(9, 3, 3, 'hay', '2025-05-21 13:14:58'),
(10, 7, 3, 'so beau!', '2025-05-22 02:43:24'),
(11, 7, 3, 'azir!', '2025-05-22 02:44:11');

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE `friendships` (
  `id` bigint(20) NOT NULL,
  `user1_id` bigint(20) NOT NULL,
  `user2_id` bigint(20) NOT NULL,
  `status` enum('PENDING','ACCEPTED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friendships`
--

INSERT INTO `friendships` (`id`, `user1_id`, `user2_id`, `status`, `created_at`) VALUES
(1, 1, 2, 'ACCEPTED', '2025-03-19 16:51:42'),
(2, 1, 3, 'ACCEPTED', '2025-03-23 11:32:08'),
(7, 3, 2, 'ACCEPTED', '2025-05-08 02:08:09');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) NOT NULL,
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(1, 4, 2, '2025-04-06 04:30:57'),
(3, 6, 1, '2025-04-06 04:36:37'),
(14, 5, 3, '2025-04-07 02:56:27'),
(19, 6, 3, '2025-04-07 03:38:06'),
(33, 4, 3, '2025-05-19 05:46:57'),
(53, 7, 3, '2025-05-22 02:50:56'),
(54, 8, 3, '2025-05-23 17:17:08');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `image_url`, `created_at`, `status`) VALUES
(3, 1, 'test', '1741963649997_Screenshot_2025-03-10_224543.png', '2025-03-14 14:47:30', b'0'),
(4, 1, 'mùa thu đẹp', '1742060945132_muathutrongrung.jpg', '2025-03-15 17:49:05', b'0'),
(5, 1, 'cơm', '1743048411353_Screenshot_2025-03-10_224821.png', '2025-03-27 04:06:51', b'0'),
(6, 3, 'Đây là Post test chữ đầu tiên', NULL, '2025-04-05 02:03:25', b'0'),
(7, 1, 'azir darkin art\r\n', '1745391212660_azir.jpg', '2025-04-23 06:53:32', b'0'),
(8, 1, 'azir', '1748020485693_1745391212660_azir.jpg', '2025-05-23 17:14:45', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(255) NOT NULL,
  `status` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `avatar_url`, `bio`, `birthday`, `gender`, `role`, `created_at`, `username`, `status`) VALUES
(1, 'John Doe', 'johndoe2@gmail.com', '$2a$10$CWcRrRDwRMnhaHsDg0vyDuNVRPfbWN1AmVRZhRyqqsTLmgcjjeQ7q', 'user_1.png', 'Hi! I\'m First user', '2004-07-14', 'FEMALE', 'USER', '2025-03-06 03:21:23', 'john doe', b'0'),
(2, 'Nguyen Huy', 'NguyenHuy@gmail.com', '$2a$10$K8ATlHkaUcDY0LgsCgZh8.F.8OydlEjv00q6mQjh24./aqURmvsea', 'warning.jpg', 'Im\'President', '2004-04-15', 'MALE', 'ADMIN', '2025-03-19 15:17:33', 'Nguyen Huy', b'0'),
(3, 'Trí Viễn Phan', 'Mwg2004@gmail.com', '$2a$10$CfhahwTvCtez8e5RFVtA1.lUraXn/m8N2iznJcuOLr9XF5x5SDqIq', '16ea51f9-4893-4b8b-b37e-797bf421121c_rider.jpg', 'I am Friend\'s President', '2025-04-16', 'FEMALE', 'USER', '2025-03-20 16:56:42', 'Trí Viễn', b'0'),
(4, 'Đình Thái', 'thainguyen1234@gmail.com', '$2a$10$EkaiUeShZL8kpDXkzVqqs.Jlr2wYbePLy9Srl4F3gdpW0g5DXn2AK', 'user_1.png', 'Chưa có thông tin gì về bạn', '2000-01-01', 'OTHER', 'USER', '2025-04-18 05:11:06', 'Đình Thái', b'1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
