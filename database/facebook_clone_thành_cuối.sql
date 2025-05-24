-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 07:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
(7, 7, 5, 'qua hay lun', '2025-05-13 12:48:51'),
(8, 4, 5, 'as', '2025-05-15 00:44:20'),
(9, 4, 5, 'as', '2025-05-15 00:44:22'),
(10, 11, 5, 'asd', '2025-05-15 02:06:56'),
(11, 11, 5, 'asd', '2025-05-15 02:09:33'),
(12, 11, 5, 'asd', '2025-05-15 02:27:44'),
(13, 11, 5, 'asd', '2025-05-15 02:27:45'),
(14, 11, 5, 'asd', '2025-05-15 02:27:46'),
(15, 11, 5, 'asd', '2025-05-15 02:27:46'),
(16, 11, 5, 'asd', '2025-05-15 02:27:47'),
(17, 11, 5, 'asd', '2025-05-15 02:27:47'),
(18, 11, 5, 'asd', '2025-05-15 02:27:47'),
(19, 11, 5, 'asd', '2025-05-15 02:27:47'),
(20, 11, 5, 'asd', '2025-05-15 02:27:48'),
(21, 11, 5, 'asd', '2025-05-15 02:27:48'),
(22, 11, 5, 'asd', '2025-05-15 02:27:48'),
(23, 11, 5, 'asd', '2025-05-15 02:27:48'),
(24, 11, 5, 'asd', '2025-05-15 02:27:49'),
(25, 11, 5, 'asd', '2025-05-15 02:27:49'),
(26, 11, 5, 'asd', '2025-05-15 02:27:49'),
(27, 12, 6, 'sad]', '2025-05-22 03:20:26'),
(28, 12, 6, 'asdasd', '2025-05-22 03:22:05'),
(29, 11, 5, 'qua hay lun anh oi', '2025-05-22 03:50:00');

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
(6, 3, 2, 'ACCEPTED', '2025-04-23 06:58:18'),
(7, 5, 2, 'PENDING', '2025-05-14 16:26:30'),
(8, 6, 5, 'ACCEPTED', '2025-05-15 00:59:49'),
(9, 5, 1, 'PENDING', '2025-05-21 05:41:06'),
(12, 6, 7, 'ACCEPTED', '2025-05-21 07:09:05'),
(13, 5, 7, 'ACCEPTED', '2025-05-21 07:09:11');

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
(21, 7, 3, '2025-04-23 06:55:18'),
(23, 8, 5, '2025-05-14 16:26:46'),
(32, 10, 5, '2025-05-15 01:06:05'),
(35, 12, 5, '2025-05-22 03:19:38'),
(36, 12, 6, '2025-05-22 03:20:07'),
(45, 11, 5, '2025-05-22 04:14:51');

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
(3, 1, 'test', '1741963649997_Screenshot_2025-03-10_224543.png', '2025-03-14 14:47:30', b'1'),
(4, 1, 'mùa thu đẹp', '1742060945132_muathutrongrung.jpg', '2025-03-15 17:49:05', b'1'),
(5, 1, 'cơm', '1743048411353_Screenshot_2025-03-10_224821.png', '2025-03-27 04:06:51', b'1'),
(6, 3, 'Đây là Post test chữ đầu tiên', NULL, '2025-04-05 02:03:25', b'1'),
(7, 1, 'azir darkin art\r\n', '1745391212660_azir.jpg', '2025-04-23 06:53:32', b'1'),
(8, 5, 'qua1 hay', '1747140918508_1375180-luffy-gear-5-sun-god-nika-one-piece-4k-pc-wallpaper.jpg', '2025-05-13 12:55:18', b'1'),
(9, 5, 'ngay dep troi', NULL, '2025-05-14 01:13:51', b'1'),
(10, 2, 'asfadas', NULL, '2025-05-14 06:06:54', b'1'),
(11, 6, 'fdhfygkuhljhgh', NULL, '2025-05-15 01:34:35', b'1'),
(12, 7, 'test', NULL, '2025-05-21 07:08:29', b'1'),
(13, 6, 'dsd', NULL, '2025-05-22 04:19:30', b'1'),
(14, 5, 'ds', NULL, '2025-05-22 04:20:15', b'1');

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
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `avatar_url`, `bio`, `birthday`, `gender`, `role`, `created_at`, `username`, `status`) VALUES
(1, 'John Doe', 'johndoe2@gmail.com', '$2a$10$CWcRrRDwRMnhaHsDg0vyDuNVRPfbWN1AmVRZhRyqqsTLmgcjjeQ7q', 'user_1.png', 'Hi! I\'m First user', '2004-07-14', 'FEMALE', 'USER', '2025-03-06 03:21:23', 'john doe', 1),
(2, 'Nguyen Huy', 'NguyenHuy@gmail.com', '$2a$10$lG1tDVOH6vztbELM.MEwNehr5BfObmvUQZ9HMoCpOtfi8xZU0C9tq', 'warning.jpg', 'Im\'President', '2004-04-15', 'MALE', 'ADMIN', '2025-03-19 15:17:33', 'Nguyen Huy', 1),
(3, 'Trí Viễn Phan', 'Mwg2004@gmail.com', '$2a$10$CfhahwTvCtez8e5RFVtA1.lUraXn/m8N2iznJcuOLr9XF5x5SDqIq', '16ea51f9-4893-4b8b-b37e-797bf421121c_rider.jpg', 'I am Friend\'s President', '2025-04-16', 'FEMALE', 'USER', '2025-03-20 16:56:42', 'Trí Viễn', 1),
(4, 'Đình Thái', 'thainguyen1234@gmail.com', '$2a$10$EkaiUeShZL8kpDXkzVqqs.Jlr2wYbePLy9Srl4F3gdpW0g5DXn2AK', 'user_1.png', 'Chưa có thông tin gì về bạn', '2000-01-01', 'OTHER', 'USER', '2025-04-18 05:11:06', 'Đình Thái', 1),
(5, 'Phạm Ngọc Châu Thành', 'chauthanh111thanh@gmail.com', '$2a$10$lG1tDVOH6vztbELM.MEwNehr5BfObmvUQZ9HMoCpOtfi8xZU0C9tq', '15979ff1-d5b6-4da5-ad51-9be018ca99a4_March_7th.jpeg', 'Chưa có thông tin gì về bạn', '2000-01-01', 'MALE', 'USER', '2025-05-13 12:35:59', 'Phạm Ngọc Châu Thành', 1),
(6, 'abc', 'abc@gmail.com', '$2a$10$0SwkQ.s0GvrFAu7rfokzX.KGbKEJ/AczD3c5QjS07kpUeKIXAtfpW', 'user_1.png', 'Chưa có thông tin gì về bạn', '2000-01-01', 'OTHER', 'USER', '2025-05-14 01:14:45', 'abc', 1),
(7, 'Thành Ngọc Châu Phạm', 'phamngocchauthanh258.com.vn@gmail.com', '$2a$10$xc4yhfszRVD7BMOkO3oBUOp1rxYY8SoUoPNkoDIZv1vSXaMZ/.1bS', '5074e9e2-49f8-4e1f-bf57-eb0cff570ec9_meme.png', 'Chưa có thông tin gì về bạn', '2000-01-01', 'OTHER', 'USER', '2025-05-21 07:02:49', 'Thành Ngọc Châu Phạm', 1);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
