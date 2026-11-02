-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sams
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_checkins`
--

DROP TABLE IF EXISTS `attendance_checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_checkins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attendance_session_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `status` enum('PRESENT','LATE','ABSENT') NOT NULL DEFAULT 'PRESENT',
  `method` enum('QR','MANUAL') NOT NULL DEFAULT 'QR',
  `checked_in_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session_student` (`attendance_session_id`,`student_id`),
  KEY `idx_session` (`attendance_session_id`),
  KEY `idx_student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_checkins`
--

LOCK TABLES `attendance_checkins` WRITE;
/*!40000 ALTER TABLE `attendance_checkins` DISABLE KEYS */;
INSERT INTO `attendance_checkins` VALUES (1,36,16,'PRESENT','QR','2025-12-22 12:25:33');
/*!40000 ALTER TABLE `attendance_checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attendance_session_id` bigint unsigned NOT NULL,
  `student_id` bigint NOT NULL,
  `take_by` bigint NOT NULL DEFAULT '0',
  `status` enum('present','absent','late') NOT NULL,
  `remark` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL DEFAULT 'attendance_records',
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `approved_by` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
INSERT INTO `attendance_records` VALUES (1,1,1,1,'present','','attendance_records',1,1,'2025-12-21 07:18:00','2025-12-06 15:42:08'),(2,1,2,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(3,1,3,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(4,2,1,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(5,2,2,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(6,2,3,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(7,3,1,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(8,3,2,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(9,3,3,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(10,4,1,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(11,4,2,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(12,4,3,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(13,5,4,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(14,5,5,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(15,5,6,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(16,6,4,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(17,6,5,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(18,6,6,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(19,7,4,1,'present','','attendance_records',1,1,'2025-12-21 07:18:47','2025-12-06 15:42:08'),(20,7,5,1,'present','','attendance_records',1,1,'2025-12-21 07:18:42','2025-12-06 15:42:08'),(21,7,6,1,'late','arrived late','attendance_records',1,1,'2025-12-21 07:18:33','2025-12-06 15:42:08'),(22,8,4,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(23,8,5,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(24,8,6,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(25,9,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(26,9,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(27,9,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(28,10,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(29,10,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(30,10,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(31,11,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(32,11,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(33,11,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(34,12,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(35,12,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(36,12,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(37,13,10,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(38,13,11,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(39,13,12,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(40,14,10,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(41,14,11,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(42,14,12,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(43,15,10,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(44,15,11,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(45,15,12,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(46,16,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(47,16,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(48,16,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(49,17,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(50,17,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(51,17,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(52,18,7,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(53,18,8,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(54,18,9,0,'late','arrived late','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(55,19,10,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(56,19,11,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(57,20,10,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(58,20,11,0,'present','','attendance_records',0,0,'2025-12-06 15:42:08','2025-12-06 15:42:08'),(59,5,10,0,'absent','ss','attendance_records',0,0,'2025-12-11 07:29:35','2025-12-11 07:29:35'),(60,5,1,0,'absent','ss','attendance_records',0,0,'2025-12-11 08:11:12','2025-12-11 08:11:12'),(61,6,1,0,'absent','qq','attendance_records',0,0,'2025-12-11 08:28:12','2025-12-11 08:28:12'),(64,31,16,0,'absent','Hello teacher I will abset this session.\n','attendance_records',0,0,'2025-12-19 16:22:47','2025-12-19 16:22:47'),(65,38,16,16,'late','sss','personal',0,0,'2025-12-19 16:46:14','2025-12-19 16:46:14'),(71,30,1,2,'present','','attendance_records',1,2,'2025-12-22 18:33:46','2025-12-22 18:33:46'),(72,30,2,2,'present','','attendance_records',1,2,'2025-12-22 18:33:46','2025-12-22 18:33:46'),(73,30,3,2,'present','','attendance_records',1,2,'2025-12-22 18:33:46','2025-12-22 18:33:46'),(78,36,1,2,'late','','attendance_records',1,2,'2025-12-22 19:26:25','2025-12-22 19:26:25'),(79,36,2,2,'present','','attendance_records',1,2,'2025-12-22 19:26:25','2025-12-22 19:26:25'),(80,36,3,2,'present','','attendance_records',1,2,'2025-12-22 19:26:25','2025-12-22 19:26:25'),(82,36,16,16,'late','I will late a bit.','personal',0,0,'2025-12-22 12:28:49','2025-12-22 12:28:49');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_sessions`
--

DROP TABLE IF EXISTS `attendance_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `schedule_id` bigint unsigned NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('planned','completed','canceled') NOT NULL DEFAULT 'planned',
  `topic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `qr_nonce` varchar(255) DEFAULT NULL,
  `qr_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_session` (`schedule_id`,`session_date`),
  CONSTRAINT `fk_attendance_sessions_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_sessions`
--

LOCK TABLES `attendance_sessions` WRITE;
/*!40000 ALTER TABLE `attendance_sessions` DISABLE KEYS */;
INSERT INTO `attendance_sessions` VALUES (1,1,'2025-12-07','08:00:00','09:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:21:07',NULL,NULL),(2,1,'2025-12-12',NULL,NULL,'completed',NULL,'2025-12-06 15:42:07','2025-12-12 12:52:23',NULL,NULL),(3,2,'2025-12-08','10:00:00','21:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-22 08:39:23','f344b8fb25a9776c4a661b276b824716','2025-12-22 15:40:24'),(4,2,'2025-12-15','10:00:00','21:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-15 12:04:08',NULL,NULL),(5,3,'2025-12-09','12:00:00','23:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-16 08:35:43',NULL,NULL),(6,3,'2025-12-16','12:00:00','23:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-16 08:35:43',NULL,NULL),(7,4,'2025-10-10','14:00:00','15:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(8,4,'2025-10-17','14:00:00','15:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(9,5,'2025-10-11','16:00:00','17:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(10,5,'2025-10-18','16:00:00','17:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(11,6,'2025-10-12','08:00:00','09:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(12,6,'2025-10-19','08:00:00','09:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(13,7,'2025-10-13','10:00:00','11:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(14,7,'2025-10-20','10:00:00','11:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(15,8,'2025-10-14','12:00:00','13:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(16,8,'2025-10-21','12:00:00','13:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(17,9,'2025-10-15','14:00:00','15:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(18,9,'2025-10-22','14:00:00','15:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(19,10,'2025-10-16','16:00:00','17:30:00','completed','Week 1 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(20,10,'2025-10-23','16:00:00','17:30:00','completed','Week 2 topic','2025-12-06 15:42:07','2025-12-11 07:42:43',NULL,NULL),(21,2,'2025-12-12',NULL,NULL,'completed',NULL,'2025-12-12 12:21:31','2025-12-12 12:21:31',NULL,NULL),(25,1,'2025-12-17',NULL,NULL,'completed',NULL,'2025-12-17 16:30:23','2025-12-17 18:49:08',NULL,NULL),(27,2,'2025-12-17',NULL,NULL,'completed',NULL,'2025-12-17 16:30:57','2025-12-17 16:30:57',NULL,NULL),(29,20,'2025-10-02','02:48:00','14:47:00','planned','Session topic','2025-12-17 19:48:07','2025-12-17 19:48:07',NULL,NULL),(30,29,'2025-12-22','08:00:00','09:00:00','completed','Session topic','2025-12-18 03:13:07','2025-12-22 11:33:46','e4f66ff04cdaedcfd41ed0a96beffe07','2025-12-22 18:38:42'),(31,29,'2025-12-29','08:00:00','09:00:00','planned','Session topic','2025-12-18 03:13:07','2025-12-18 03:13:07',NULL,NULL),(32,29,'2026-01-05','08:00:00','09:00:00','planned','Session topic','2025-12-18 03:13:07','2025-12-18 03:13:07',NULL,NULL),(33,29,'2026-01-26','08:00:00','09:00:00','planned','Session topic','2025-12-18 03:13:07','2025-12-18 03:13:07',NULL,NULL),(34,29,'2026-01-12','08:00:00','09:00:00','planned','Session topic','2025-12-18 03:13:07','2025-12-18 03:13:07',NULL,NULL),(35,29,'2026-01-19','08:00:00','09:00:00','planned','Session topic','2025-12-18 03:13:07','2025-12-18 03:13:07',NULL,NULL),(36,30,'2025-12-22','08:00:00','24:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-22 15:57:14','60e9e1faee95de10ca0a06eb4aae6ccf','2025-12-22 23:02:14'),(37,30,'2026-01-05','08:00:00','09:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-18 03:14:15',NULL,NULL),(38,30,'2025-12-29','08:00:00','09:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-18 03:14:15',NULL,NULL),(39,30,'2026-01-26','08:00:00','09:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-18 03:14:15',NULL,NULL),(40,30,'2026-01-12','08:00:00','09:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-18 03:14:15',NULL,NULL),(41,30,'2026-01-19','08:00:00','09:00:00','planned','function indexOf() { [native code] }','2025-12-18 03:14:15','2025-12-18 03:14:15',NULL,NULL),(42,1,'2025-12-20','08:00:00','09:00:00','completed',NULL,'2025-12-20 06:01:25','2025-12-21 08:09:54',NULL,NULL),(43,1,'2025-12-21',NULL,NULL,'completed',NULL,'2025-12-21 08:04:09','2025-12-21 08:04:09',NULL,NULL);
/*!40000 ALTER TABLE `attendance_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subjects`
--

DROP TABLE IF EXISTS `class_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint unsigned NOT NULL,
  `subject_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_subjects_class_id_subject_id_unique` (`class_id`,`subject_id`),
  KEY `class_subjects_subject_id_foreign` (`subject_id`),
  KEY `fk_class_subjects_teacher` (`teacher_id`),
  CONSTRAINT `class_subjects_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `fk_class_subjects_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_class_subjects_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subjects`
--

LOCK TABLES `class_subjects` WRITE;
/*!40000 ALTER TABLE `class_subjects` DISABLE KEYS */;
INSERT INTO `class_subjects` VALUES (1,1,1,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,1,2,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,1,3,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,2,2,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,2,3,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,2,4,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,3,1,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(8,3,4,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(9,3,5,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(10,4,4,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(11,4,5,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(12,4,6,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(13,5,7,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(14,5,8,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(15,5,11,5,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(16,6,9,4,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(17,6,10,4,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(18,6,12,5,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `class_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `grade_level` int DEFAULT NULL,
  `major_id` bigint unsigned DEFAULT NULL,
  `school_year_id` bigint unsigned NOT NULL,
  `term_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classes_school_year_id_foreign` (`school_year_id`),
  KEY `fk_classes_major` (`major_id`),
  KEY `fk_classes_term` (`term_id`),
  CONSTRAINT `classes_school_year_id_foreign` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`),
  CONSTRAINT `fk_classes_major` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_classes_term` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'Y1-IT-A',1,1,3,6,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'Y2-IT-A',2,1,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,'Y1-CS-A',1,2,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,'Y2-CS-A',2,2,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,'Y3-BM-A',3,3,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,'Y3-FB-A',3,4,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `faculty_id` bigint unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_department_code` (`code`),
  KEY `fk_departments_faculty` (`faculty_id`),
  CONSTRAINT `fk_departments_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,1,'Department of Information Technology','DIT','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,1,'Department of Computer Science','DCS','2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,2,'Department of Management','DM','2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,2,'Department of Finance and Banking','DFB','2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,3,'Department of International Relations','DIR','2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `face_verification_logs`
--

DROP TABLE IF EXISTS `face_verification_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `face_verification_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `attendance_session_id` bigint unsigned DEFAULT NULL,
  `score` float DEFAULT NULL,
  `result` enum('success','fail') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face_verification_logs`
--

LOCK TABLES `face_verification_logs` WRITE;
/*!40000 ALTER TABLE `face_verification_logs` DISABLE KEYS */;
INSERT INTO `face_verification_logs` VALUES (4,26,43,NULL,'fail','2025-12-21 09:42:42'),(5,26,43,NULL,'fail','2025-12-21 09:43:07'),(6,26,43,NULL,'fail','2025-12-21 09:45:51'),(7,26,43,NULL,'fail','2025-12-21 09:48:19'),(8,26,43,NULL,'fail','2025-12-21 09:48:34'),(9,26,43,NULL,'fail','2025-12-21 09:49:23'),(10,26,43,NULL,'fail','2025-12-21 09:50:03'),(11,26,43,NULL,'fail','2025-12-21 09:50:25'),(12,26,43,0,'success','2025-12-21 09:52:14'),(13,26,43,NULL,'fail','2025-12-21 09:53:39'),(14,26,43,NULL,'fail','2025-12-21 09:54:08'),(15,26,43,0,'success','2025-12-21 09:55:32'),(16,26,43,0,'success','2025-12-21 09:56:55'),(17,26,43,0,'success','2025-12-21 10:04:09');
/*!40000 ALTER TABLE `face_verification_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `code` varchar(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_faculty_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,'Faculty of Engineering','FE','1765617533785.png','2025-12-06 15:42:07','2025-12-13 09:18:53'),(2,'Faculty of Business Administration ','FB','1765617785068.png','2025-12-06 15:42:07','2025-12-13 09:23:05'),(3,'Faculty of Social Sciences','FSS',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `majors`
--

DROP TABLE IF EXISTS `majors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `majors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `department_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `majors_code_unique` (`code`),
  KEY `fk_majors_department` (`department_id`),
  CONSTRAINT `fk_majors_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `majors`
--

LOCK TABLES `majors` WRITE;
/*!40000 ALTER TABLE `majors` DISABLE KEYS */;
INSERT INTO `majors` VALUES (1,'Information Technology','IT',1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'Computer Science','CS',2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,'Business Management','BM',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,'Finance and Banking','FB',4,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,'International Relations','IR',5,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `majors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `capacity` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rooms_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'E301',40,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'E302',40,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,'E305',40,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,'Lab1',35,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,'B201',40,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,'B202',40,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_subject_id` bigint unsigned NOT NULL,
  `room_id` bigint unsigned DEFAULT NULL,
  `day_of_week` tinyint NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedules_class_subject` (`class_subject_id`),
  KEY `fk_schedules_room` (`room_id`),
  CONSTRAINT `fk_schedules_class_subject` FOREIGN KEY (`class_subject_id`) REFERENCES `class_subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedules_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,1,1,'08:00:00','24:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,2,2,2,'10:00:00','11:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,3,3,3,'12:00:00','13:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,4,4,4,'14:00:00','15:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,5,5,5,'16:00:00','17:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,6,6,6,'08:00:00','09:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,7,1,1,'10:00:00','11:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(8,8,2,2,'12:00:00','13:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(9,9,3,3,'14:00:00','15:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(10,10,4,4,'16:00:00','17:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(11,11,5,5,'08:00:00','09:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(12,12,6,6,'10:00:00','11:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(13,13,1,1,'12:00:00','13:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(14,14,2,2,'14:00:00','15:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(15,15,3,3,'16:00:00','17:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(16,16,4,4,'08:00:00','09:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(17,17,5,5,'10:00:00','11:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(18,18,6,6,'12:00:00','13:30:00','2025-12-06 15:42:07','2025-12-06 15:42:07'),(19,1,1,1,'01:00:00','12:00:00','2025-12-17 19:35:01','2025-12-17 19:35:01'),(20,1,1,4,'02:48:00','14:47:00','2025-12-17 19:48:07','2025-12-17 19:48:07'),(21,1,1,6,'03:03:00','15:03:00','2025-12-17 20:03:49','2025-12-17 20:03:49'),(22,1,1,1,'08:00:00','09:00:00','2025-12-18 03:05:37','2025-12-18 03:05:37'),(23,1,1,1,'08:00:00','09:00:00','2025-12-18 03:06:49','2025-12-18 03:06:49'),(24,1,1,1,'08:00:00','09:00:00','2025-12-18 03:07:06','2025-12-18 03:07:06'),(25,1,1,1,'08:00:00','09:00:00','2025-12-18 03:07:33','2025-12-18 03:07:33'),(26,1,1,1,'08:00:00','09:00:00','2025-12-18 03:07:52','2025-12-18 03:07:52'),(27,1,1,1,'08:00:00','09:00:00','2025-12-18 03:11:03','2025-12-18 03:11:03'),(28,1,1,1,'08:00:00','09:00:00','2025-12-18 03:12:21','2025-12-18 03:12:21'),(29,1,1,1,'08:00:00','09:00:00','2025-12-18 03:13:07','2025-12-18 03:13:07'),(30,1,1,1,'08:00:00','09:00:00','2025-12-18 03:14:15','2025-12-18 03:14:15');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_years`
--

DROP TABLE IF EXISTS `school_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_years`
--

LOCK TABLES `school_years` WRITE;
/*!40000 ALTER TABLE `school_years` DISABLE KEYS */;
INSERT INTO `school_years` VALUES (1,'2023-2024','2023-10-01','2024-07-31','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'2024-2025','2024-09-28','2025-04-26','2025-12-06 15:42:07','2025-12-18 04:47:46'),(3,'2025-2026','2025-12-01','2026-01-01','2025-12-17 19:32:44','2025-12-17 19:32:44'),(4,'2025-2026','2026-01-01','2026-01-31','2025-12-18 05:24:27','2025-12-18 05:24:27');
/*!40000 ALTER TABLE `school_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'beltei international school','1766406313374.png','Phnom Penh, Cambodia',11.5531660,104.9247070,'2025-12-17 19:16:17','2025-12-22 12:25:13');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `student_code` varchar(50) NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `face_descriptor` json DEFAULT NULL,
  `face_updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `students_student_code_unique` (`student_code`),
  KEY `students_class_id_foreign` (`class_id`),
  KEY `fk_students_user` (`user_id`),
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `students_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,10,'Vannak','Sok',NULL,'S0010',1,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(2,11,'Sreyneang','Chhun',NULL,'S0011',1,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(3,12,'Rachana','Phan',NULL,'S0012',1,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(4,13,'Sokchea','Teang',NULL,'S0013',2,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(5,14,'Dara','Lim',NULL,'S0014',2,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(6,15,'Sophea','Nou',NULL,'S0015',2,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(7,16,'Chanthy','Ouk',NULL,'S0016',3,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(8,17,'Piseth','Kim',NULL,'S0017',3,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(9,18,'Rith','Yim',NULL,'S0018',3,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(10,19,'Sreymom','San',NULL,'S0019',4,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(11,20,'Sok','Hun',NULL,'S0020',4,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(12,21,'Dara','Chea',NULL,'S0021',5,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(13,22,'Navy','Khim',NULL,'S0022',5,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(14,23,'Pheak','Suos',NULL,'S0023',6,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(15,24,'Lina','Hem',NULL,'S0024',6,'active','2025-12-06 15:42:07','2025-12-06 15:42:07',NULL,NULL),(16,26,'Phearom','Chea','1765796714991.jpg','S0025',1,'active','2025-12-15 11:05:15','2025-12-21 10:04:09','[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]',NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `credit` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subjects_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'IT101','Introduction to IT',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'IT102','Programming I',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,'IT103','Computer Systems',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,'CS201','Data Structures',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,'CS202','Database Systems',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,'CS203','Operating Systems',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,'BM301','Principles of Management',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(8,'BM302','Marketing Management',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(9,'FB301','Financial Management',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(10,'FB302','Banking Operations',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(11,'IR201','Introduction to International Relations',3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(12,'IR202','Diplomacy and Foreign Policy',3,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_attendance`
--

DROP TABLE IF EXISTS `teacher_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_attendance` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attendance_session_id` bigint unsigned NOT NULL,
  `status` enum('present','absent','on_leave','late') NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_teacher_session` (`attendance_session_id`),
  CONSTRAINT `fk_teacher_attendance_session` FOREIGN KEY (`attendance_session_id`) REFERENCES `attendance_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_attendance`
--

LOCK TABLES `teacher_attendance` WRITE;
/*!40000 ALTER TABLE `teacher_attendance` DISABLE KEYS */;
INSERT INTO `teacher_attendance` VALUES (1,1,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,2,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,3,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,4,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,5,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,6,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,7,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(8,8,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(9,9,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(10,10,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(11,11,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(12,12,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(13,13,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(14,14,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(15,15,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(16,16,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(17,17,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(18,18,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(19,19,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(20,20,'present',NULL,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(21,43,'absent','11','2025-12-21 18:01:51','2025-12-21 18:01:51');
/*!40000 ALTER TABLE `teacher_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_classes`
--

DROP TABLE IF EXISTS `teacher_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teacher_classes_teacher_id_class_id_unique` (`teacher_id`,`class_id`),
  KEY `teacher_classes_class_id_foreign` (`class_id`),
  CONSTRAINT `fk_teacher_classes_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teacher_classes_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_classes`
--

LOCK TABLES `teacher_classes` WRITE;
/*!40000 ALTER TABLE `teacher_classes` DISABLE KEYS */;
INSERT INTO `teacher_classes` VALUES (1,1,1,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,1,2,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,2,3,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,2,4,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,3,5,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,4,6,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,5,5,'2025-12-06 15:42:07','2025-12-06 15:42:07'),(8,5,6,'2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `teacher_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `employee_code` varchar(50) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teachers_employee_code_unique` (`employee_code`),
  KEY `teachers_user_id_foreign` (`user_id`),
  CONSTRAINT `teachers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,2,'Chenda','Keo',NULL,'T-IT-001','active','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,3,'Dara','Sorn',NULL,'T-CS-001','active','2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,4,'Srey Pich','Men',NULL,'T-BM-001','active','2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,5,'Rith','Ly',NULL,'T-FB-001','active','2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,6,'Chanthy','Oum',NULL,'T-IR-001','active','2025-12-06 15:42:07','2025-12-06 15:42:07');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_year_id` bigint unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_terms_school_year` (`school_year_id`),
  CONSTRAINT `fk_terms_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
INSERT INTO `terms` VALUES (1,1,'Semester 1 2024-2025','2024-10-01','2025-02-15','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,1,'Semester 2 2024-2025','2025-02-16','2025-07-31','2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,2,'Semester 1 2025-2026','2025-10-01','2026-02-15','2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,2,'Semester 2 2025-2026','2026-02-16','2026-07-31','2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,3,'Semester 1 2025-2026','2025-12-01','2025-12-10','2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,3,'Semester 2 2025-2026','2025-12-20','2026-02-01','2025-12-06 15:42:07','2025-12-06 15:42:07'),(7,4,'Term1','2026-01-01','2026-04-16','2025-12-18 05:24:27','2025-12-18 05:24:27'),(8,4,'Term2','2026-04-16','2026-07-30','2025-12-18 05:24:27','2025-12-18 05:24:27');
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Admin','admin@sams.edu.kh',NULL,'System','Admin',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','admin','2025-12-06 15:42:07','2025-12-06 15:42:07'),(2,'Keo Chenda','chenda.keo@sams.edu.kh',NULL,'Chenda','Keo',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','teacher','2025-12-06 15:42:07','2025-12-06 15:42:07'),(3,'Sorn Dara','dara.sorn@sams.edu.kh',NULL,'Dara','Sorn',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','teacher','2025-12-06 15:42:07','2025-12-06 15:42:07'),(4,'Men Srey Pich','sreypich.men@sams.edu.kh',NULL,'Srey Pich','Men',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','teacher','2025-12-06 15:42:07','2025-12-06 15:42:07'),(5,'Ly Rith','rith.ly@sams.edu.kh',NULL,'Rith','Ly',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','teacher','2025-12-06 15:42:07','2025-12-06 15:42:07'),(6,'Oum Chanthy','chanthy.oum@sams.edu.kh',NULL,'Chanthy','Oum',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','teacher','2025-12-06 15:42:07','2025-12-06 15:42:07'),(10,'Sok Vannak','vannak.sok@sams.edu.kh',NULL,'Vannak','Sok',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(11,'Chhun Sreyneang','sreyneang.chhun@sams.edu.kh',NULL,'Sreyneang','Chhun',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(12,'Phan Rachana','rachana.phan@sams.edu.kh',NULL,'Rachana','Phan',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(13,'Teang Sokchea','sokchea.teang@sams.edu.kh',NULL,'Sokchea','Teang',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(14,'Lim Dara','dara.lim@sams.edu.kh',NULL,'Dara','Lim',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(15,'Nou Sophea','sophea.nou@sams.edu.kh',NULL,'Sophea','Nou',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(16,'Ouk Chanthy','chanthy.ouk@sams.edu.kh',NULL,'Chanthy','Ouk',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(17,'Kim Piseth','piseth.kim@sams.edu.kh',NULL,'Piseth','Kim',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(18,'Yim Rith','rith.yim@sams.edu.kh',NULL,'Rith','Yim',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(19,'San Sreymom','sreymom.san@sams.edu.kh',NULL,'Sreymom','San',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(20,'Hun Sok','sok.hun@sams.edu.kh',NULL,'Sok','Hun',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(21,'Chea Dara','dara.chea@sams.edu.kh',NULL,'Dara','Chea',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(22,'Khim Navy','navy.khim@sams.edu.kh',NULL,'Navy','Khim',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(23,'Suos Pheak','pheak.suos@sams.edu.kh',NULL,'Pheak','Suos',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(24,'Hem Lina','lina.hem@sams.edu.kh',NULL,'Lina','Hem',NULL,'$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','student','2025-12-06 15:42:07','2025-12-06 15:42:07'),(25,'Phearom','phearomchea21@gmail.com',NULL,NULL,NULL,'1765194158053.jpg','$2a$10$CEhX.rKfUmJ.iPK2kEHl4eUNaisIyw4qNaqtBHnGc613v4nCdQuMC','admin','2025-12-08 11:42:38','2025-12-08 11:42:38'),(26,'Phearom','phearomchea210920@gmail.com',NULL,'Phearom','Chea',NULL,'$2a$10$XfaFfR87hoLUlujdGslvV.e.Tclpcu3e01Ew4jaZANNPMZFo2NoLK','student','2025-12-15 11:05:15','2025-12-15 11:05:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_class_attendance_summary`
--

DROP TABLE IF EXISTS `v_class_attendance_summary`;
/*!50001 DROP VIEW IF EXISTS `v_class_attendance_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_class_attendance_summary` AS SELECT 
 1 AS `class_id`,
 1 AS `class_name`,
 1 AS `student_count`,
 1 AS `present_count`,
 1 AS `absent_count`,
 1 AS `late_count`,
 1 AS `total_records`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_monthly_attendance_summary`
--

DROP TABLE IF EXISTS `v_monthly_attendance_summary`;
/*!50001 DROP VIEW IF EXISTS `v_monthly_attendance_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_monthly_attendance_summary` AS SELECT 
 1 AS `ym`,
 1 AS `class_id`,
 1 AS `class_name`,
 1 AS `student_count`,
 1 AS `present_count`,
 1 AS `absent_count`,
 1 AS `late_count`,
 1 AS `total_records`,
 1 AS `present_percent`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_student_attendance`
--

DROP TABLE IF EXISTS `v_student_attendance`;
/*!50001 DROP VIEW IF EXISTS `v_student_attendance`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_student_attendance` AS SELECT 
 1 AS `attendance_record_id`,
 1 AS `session_date`,
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `student_code`,
 1 AS `attendance_status`,
 1 AS `remark`,
 1 AS `class_id`,
 1 AS `class_name`,
 1 AS `subject_id`,
 1 AS `subject_name`,
 1 AS `teacher_id`,
 1 AS `teacher_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_subject_attendance_summary`
--

DROP TABLE IF EXISTS `v_subject_attendance_summary`;
/*!50001 DROP VIEW IF EXISTS `v_subject_attendance_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_subject_attendance_summary` AS SELECT 
 1 AS `subject_id`,
 1 AS `subject_name`,
 1 AS `class_id`,
 1 AS `class_name`,
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `present_count`,
 1 AS `absent_count`,
 1 AS `late_count`,
 1 AS `total_records`,
 1 AS `present_percent`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_teacher_attendance`
--

DROP TABLE IF EXISTS `v_teacher_attendance`;
/*!50001 DROP VIEW IF EXISTS `v_teacher_attendance`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_teacher_attendance` AS SELECT 
 1 AS `teacher_attendance_id`,
 1 AS `session_date`,
 1 AS `teacher_id`,
 1 AS `teacher_name`,
 1 AS `class_id`,
 1 AS `class_name`,
 1 AS `subject_id`,
 1 AS `subject_name`,
 1 AS `attendance_status`,
 1 AS `remark`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_class_attendance_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_class_attendance_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_class_attendance_summary` AS select `c`.`id` AS `class_id`,`c`.`name` AS `class_name`,count(distinct `ar`.`student_id`) AS `student_count`,sum((`ar`.`status` = 'present')) AS `present_count`,sum((`ar`.`status` = 'absent')) AS `absent_count`,sum((`ar`.`status` = 'late')) AS `late_count`,count(`ar`.`id`) AS `total_records` from ((((`attendance_records` `ar` join `attendance_sessions` `asess` on((`ar`.`attendance_session_id` = `asess`.`id`))) join `schedules` `sch` on((`asess`.`schedule_id` = `sch`.`id`))) join `class_subjects` `cs` on((`sch`.`class_subject_id` = `cs`.`id`))) join `classes` `c` on((`cs`.`class_id` = `c`.`id`))) group by `c`.`id`,`c`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_monthly_attendance_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_monthly_attendance_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_monthly_attendance_summary` AS select date_format(`asess`.`session_date`,'%Y-%m') AS `ym`,`c`.`id` AS `class_id`,`c`.`name` AS `class_name`,count(distinct `ar`.`student_id`) AS `student_count`,sum((`ar`.`status` = 'present')) AS `present_count`,sum((`ar`.`status` = 'absent')) AS `absent_count`,sum((`ar`.`status` = 'late')) AS `late_count`,count(`ar`.`id`) AS `total_records`,round(((sum((`ar`.`status` = 'present')) / count(`ar`.`id`)) * 100),2) AS `present_percent` from ((((`attendance_records` `ar` join `attendance_sessions` `asess` on((`ar`.`attendance_session_id` = `asess`.`id`))) join `schedules` `sch` on((`asess`.`schedule_id` = `sch`.`id`))) join `class_subjects` `cs` on((`sch`.`class_subject_id` = `cs`.`id`))) join `classes` `c` on((`cs`.`class_id` = `c`.`id`))) group by `ym`,`c`.`id`,`c`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_attendance`
--

/*!50001 DROP VIEW IF EXISTS `v_student_attendance`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_attendance` AS select `ar`.`id` AS `attendance_record_id`,`asess`.`session_date` AS `session_date`,`ar`.`student_id` AS `student_id`,`s`.`first_name` AS `student_name`,`s`.`student_code` AS `student_code`,`ar`.`status` AS `attendance_status`,`ar`.`remark` AS `remark`,`c`.`id` AS `class_id`,`c`.`name` AS `class_name`,`sub`.`id` AS `subject_id`,`sub`.`name` AS `subject_name`,`t`.`id` AS `teacher_id`,`t`.`first_name` AS `teacher_name` from (((((((`attendance_records` `ar` join `attendance_sessions` `asess` on((`ar`.`attendance_session_id` = `asess`.`id`))) join `schedules` `sch` on((`asess`.`schedule_id` = `sch`.`id`))) join `class_subjects` `cs` on((`sch`.`class_subject_id` = `cs`.`id`))) join `classes` `c` on((`cs`.`class_id` = `c`.`id`))) join `subjects` `sub` on((`cs`.`subject_id` = `sub`.`id`))) left join `teachers` `t` on((`cs`.`teacher_id` = `t`.`id`))) join `students` `s` on((`ar`.`student_id` = `s`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_subject_attendance_summary`
--

/*!50001 DROP VIEW IF EXISTS `v_subject_attendance_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_subject_attendance_summary` AS select `sub`.`id` AS `subject_id`,`sub`.`name` AS `subject_name`,`c`.`id` AS `class_id`,`c`.`name` AS `class_name`,`s`.`id` AS `student_id`,`s`.`first_name` AS `student_name`,sum((`ar`.`status` = 'present')) AS `present_count`,sum((`ar`.`status` = 'absent')) AS `absent_count`,sum((`ar`.`status` = 'late')) AS `late_count`,count(`ar`.`id`) AS `total_records`,round(((sum((`ar`.`status` = 'present')) / count(`ar`.`id`)) * 100),2) AS `present_percent` from ((((((`attendance_records` `ar` join `attendance_sessions` `asess` on((`ar`.`attendance_session_id` = `asess`.`id`))) join `schedules` `sch` on((`asess`.`schedule_id` = `sch`.`id`))) join `class_subjects` `cs` on((`sch`.`class_subject_id` = `cs`.`id`))) join `subjects` `sub` on((`cs`.`subject_id` = `sub`.`id`))) join `classes` `c` on((`cs`.`class_id` = `c`.`id`))) join `students` `s` on((`ar`.`student_id` = `s`.`id`))) group by `sub`.`id`,`c`.`id`,`s`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_teacher_attendance`
--

/*!50001 DROP VIEW IF EXISTS `v_teacher_attendance`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_teacher_attendance` AS select `ta`.`id` AS `teacher_attendance_id`,`asess`.`session_date` AS `session_date`,`t`.`id` AS `teacher_id`,`t`.`first_name` AS `teacher_name`,`c`.`id` AS `class_id`,`c`.`name` AS `class_name`,`sub`.`id` AS `subject_id`,`sub`.`name` AS `subject_name`,`ta`.`status` AS `attendance_status`,`ta`.`remark` AS `remark` from ((((((`teacher_attendance` `ta` join `attendance_sessions` `asess` on((`ta`.`attendance_session_id` = `asess`.`id`))) join `schedules` `sch` on((`asess`.`schedule_id` = `sch`.`id`))) join `class_subjects` `cs` on((`sch`.`class_subject_id` = `cs`.`id`))) join `classes` `c` on((`cs`.`class_id` = `c`.`id`))) join `subjects` `sub` on((`cs`.`subject_id` = `sub`.`id`))) join `teachers` `t` on((`cs`.`teacher_id` = `t`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 23:07:58
