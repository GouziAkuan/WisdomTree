/*
 Navicat Premium Dump SQL

 Source Server         : akuan
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : wisdom_tree

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 06/05/2025 22:55:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `coverImageUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `plannedCapacity` int NOT NULL,
  `currentCapacity` int NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `adminId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_623e08fea9291edae8a4aa93224`(`adminId` ASC) USING BTREE,
  CONSTRAINT `FK_623e08fea9291edae8a4aa93224` FOREIGN KEY (`adminId`) REFERENCES `admin_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (1, '今日户外 一起种树！🌳', '今天参加植树活动，呵嘿，起土，土土土，起起起\n超级腊梅花，勇闯试验田！\n羡慕别人种好的树，嘲笑别人种歪的树\n然后我们的树有点种歪了\n真是可恶！', 'http://127.0.0.1:8080/static/d99e63fb-3ae9-49c1-84b7-a09afab7e770.jpg', '2025-05-01 09:00:00', '2025-05-01 17:30:00', '图书馆外围', 10, 1, '2025-04-16 14:35:14.413773', '2025-04-16 15:08:02.000000', 1);

-- ----------------------------
-- Table structure for activity_users
-- ----------------------------
DROP TABLE IF EXISTS `activity_users`;
CREATE TABLE `activity_users`  (
  `activity_id` int NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  PRIMARY KEY (`activity_id`, `user_id`) USING BTREE,
  INDEX `IDX_8c341fcf97d5f9415cc85bb8b0`(`activity_id` ASC) USING BTREE,
  INDEX `IDX_13527b3fa752888ee637e5db8a`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK_13527b3fa752888ee637e5db8a8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_8c341fcf97d5f9415cc85bb8b0c` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of activity_users
-- ----------------------------
INSERT INTO `activity_users` VALUES (1, 4);

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'admin', 'GucTree', '$2b$10$eJXFrrNr4B1sgmm/B6W.YuE4KJDoZAaFi0itKfV0xS09O9p7xfyyi', '2024-08-24 18:42:24.110509', '2025-04-16 14:26:05.726770');

-- ----------------------------
-- Table structure for adoptions
-- ----------------------------
DROP TABLE IF EXISTS `adoptions`;
CREATE TABLE `adoptions`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `adoption_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tree_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `wish` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `adopted_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int UNSIGNED NULL DEFAULT NULL,
  `tree_id` int UNSIGNED NULL DEFAULT NULL,
  `type_id` int UNSIGNED NULL DEFAULT NULL,
  `area` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_c78ea086089090f0885ac31e7b`(`adoption_id` ASC) USING BTREE,
  INDEX `FK_f81edbad0eff59ae0c9883b08dd`(`user_id` ASC) USING BTREE,
  INDEX `FK_5afb0745257feaaaca98fca786f`(`tree_id` ASC) USING BTREE,
  INDEX `FK_3c9402e0a6bcd249f1d185ed960`(`type_id` ASC) USING BTREE,
  CONSTRAINT `FK_3c9402e0a6bcd249f1d185ed960` FOREIGN KEY (`type_id`) REFERENCES `tree_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_5afb0745257feaaaca98fca786f` FOREIGN KEY (`tree_id`) REFERENCES `trees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_f81edbad0eff59ae0c9883b08dd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of adoptions
-- ----------------------------
INSERT INTO `adoptions` VALUES (31, '202504031627371', '狗子是阿宽的球迷', '爱情纪念树', '向下扎根,向上生长,初心不改，未来可期!', '2025-05-02 16:27:37.000000', '2025-05-03 00:43:22.382972', 4, 249, 60, '运动场');

-- ----------------------------
-- Table structure for collect
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NULL DEFAULT NULL,
  `userId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_c1c5be4c0d475a1dcf1cf677c4d`(`postId` ASC) USING BTREE,
  INDEX `FK_046900799ba1e2244ceffff87b4`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_046900799ba1e2244ceffff87b4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c1c5be4c0d475a1dcf1cf677c4d` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of collect
-- ----------------------------
INSERT INTO `collect` VALUES (3, 1, 4);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `postId` int NULL DEFAULT NULL,
  `userId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_94a85bb16d24033a2afdd5df060`(`postId` ASC) USING BTREE,
  INDEX `FK_c0354a9a009d3bb45a08655ce3b`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_94a85bb16d24033a2afdd5df060` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, '有意思', '2025-04-16 15:19:42.118003', '2025-04-16 15:19:42.118003', 1, 4);

-- ----------------------------
-- Table structure for energy
-- ----------------------------
DROP TABLE IF EXISTS `energy`;
CREATE TABLE `energy`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `receivedEnergy` int NOT NULL DEFAULT 0,
  `energy` int NOT NULL DEFAULT 0,
  `finish` tinyint NOT NULL DEFAULT 0,
  `date` date NOT NULL,
  `userId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_ee7363f689396af21bfe69147e`(`userId` ASC, `date` ASC) USING BTREE,
  CONSTRAINT `FK_2e9b3e249cc7b5911abe035498b` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of energy
-- ----------------------------
INSERT INTO `energy` VALUES (4, 1, 83, 0, '2025-04-29', 4);
INSERT INTO `energy` VALUES (9, 0, 121, 0, '2025-04-30', 4);
INSERT INTO `energy` VALUES (17, 0, 138, 0, '2025-05-01', 4);

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `postId` int NULL DEFAULT NULL,
  `userId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_e2fe567ad8d305fefc918d44f50`(`postId` ASC) USING BTREE,
  INDEX `FK_cfd8e81fac09d7339a32e57d904`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_cfd8e81fac09d7339a32e57d904` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e2fe567ad8d305fefc918d44f50` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO `likes` VALUES (7, '2025-04-30 23:38:02.805902', 1, 4);

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'daily',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_5c1cf55c308037b5aca1038a131`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_5c1cf55c308037b5aca1038a131` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES (1, '公益植树🌳还能这么玩？环保达人都在冲！', '春回大地，三四月份就像大自然发出的 “邀请函”💌，正是植树造林的好时候🌱！植树造林是保护环境超有效的传统方式，也是力所能及助力可持续发展的有力行动💪。\n今天给大家分享公益植树宝藏玩法，诚邀企业、组织还有环保人士一起加入哦🤝\n👨‍👩‍👧‍👦【亲子齐出动，共植成长树】', '日常', 'http://127.0.0.1:8080/static/e0b19d36-5795-4e68-a19f-ab02fd7f5a30.jpg', '2025-04-16 15:19:23.963050', '2025-04-16 15:19:23.963050', 4);

-- ----------------------------
-- Table structure for tree_images
-- ----------------------------
DROP TABLE IF EXISTS `tree_images`;
CREATE TABLE `tree_images`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `detailImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `tree_id` int UNSIGNED NULL DEFAULT NULL,
  `type_id` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_3432df02770ab99f91cc881cd7e`(`tree_id` ASC) USING BTREE,
  INDEX `FK_79bf9f531baccb5e0ae92e4a8db`(`type_id` ASC) USING BTREE,
  CONSTRAINT `FK_3432df02770ab99f91cc881cd7e` FOREIGN KEY (`tree_id`) REFERENCES `trees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_79bf9f531baccb5e0ae92e4a8db` FOREIGN KEY (`type_id`) REFERENCES `tree_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 330 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tree_images
-- ----------------------------
INSERT INTO `tree_images` VALUES (325, 'http://127.0.0.1:8080/static/mrtree.png', '2025-04-16 16:20:36.303731', '2025-04-16 16:20:36.303731', 250, 60);
INSERT INTO `tree_images` VALUES (326, 'http://127.0.0.1:8080/static/mrtree.png', '2025-04-16 16:20:36.303731', '2025-04-16 16:20:36.303731', 251, 60);
INSERT INTO `tree_images` VALUES (327, 'http://127.0.0.1:8080/static/mrtree.png', '2025-04-16 16:20:36.303731', '2025-04-16 16:20:36.303731', 252, 60);
INSERT INTO `tree_images` VALUES (328, 'http://127.0.0.1:8080/static/mrtree.png', '2025-04-16 16:20:36.303731', '2025-04-16 16:20:36.303731', 253, 60);
INSERT INTO `tree_images` VALUES (329, 'http://127.0.0.1:8080/static/mrtree.png', '2025-04-16 16:39:41.933362', '2025-04-16 16:39:41.933362', 249, 60);

-- ----------------------------
-- Table structure for tree_type
-- ----------------------------
DROP TABLE IF EXISTS `tree_type`;
CREATE TABLE `tree_type`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `scientific_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `common_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total` int NOT NULL,
  `remaining` int NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `energy` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_7a05d9ecf95cb260c02ec44e2b`(`scientific_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tree_type
-- ----------------------------
INSERT INTO `tree_type` VALUES (60, 'http://127.0.0.1:8080/static/bcad0668-2cf0-4649-a04d-c7be3343a3c9.jpg', '白桂木', '白桂木', '白桂木是桑科、波罗蜜属乔木，全株有乳汁；树皮暗紫色，成薄片剥落；小枝被略紧贴的柔毛；单叶互生；叶片圆形或倒卵状长圆形，全缘，嫩叶常为羽状浅裂，上面无毛有光泽，下面密被灰白色短绒毛；花单性，雌雄同株；雄花序单个腋生，倒卵形或棒状形；聚合果近球形，黄色，干时褐色，花期春末夏初，果期秋季。 ', 5, 4, '2025-04-16 16:20:36.157272', '2025-04-30 16:32:36.000000', 100);

-- ----------------------------
-- Table structure for trees
-- ----------------------------
DROP TABLE IF EXISTS `trees`;
CREATE TABLE `trees`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `isAdopted` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `type_id` int UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_d2658435e2ce0d5f42bfd0157d8`(`type_id` ASC) USING BTREE,
  CONSTRAINT `FK_d2658435e2ce0d5f42bfd0157d8` FOREIGN KEY (`type_id`) REFERENCES `tree_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 254 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of trees
-- ----------------------------
INSERT INTO `trees` VALUES (249, 1, '2025-04-16 16:20:36.213643', '2025-04-16 16:27:37.000000', 60);
INSERT INTO `trees` VALUES (250, 0, '2025-04-16 16:20:36.232293', '2025-04-16 16:20:36.232293', 60);
INSERT INTO `trees` VALUES (251, 0, '2025-04-16 16:20:36.248862', '2025-04-16 16:20:36.248862', 60);
INSERT INTO `trees` VALUES (252, 0, '2025-04-16 16:20:36.265021', '2025-04-16 16:20:36.265021', 60);
INSERT INTO `trees` VALUES (253, 0, '2025-04-16 16:20:36.281097', '2025-04-16 16:20:36.281097', 60);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `energy` int NOT NULL DEFAULT 0,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (4, 'user', 'http://127.0.0.1:8080/static/mrtx.png', '18836477658', 'akuan', '$2b$10$fvHsXaa.LYUcthVPVPeGPePCiuSbCFi92YIAQaUjilejN.yL1w0di', '2024-09-08 16:55:01.184167', '2025-05-01 12:33:01.000000', 1, 'oaLCh7U_PR26s-4Pok0_TgL8wjKE');

SET FOREIGN_KEY_CHECKS = 1;
