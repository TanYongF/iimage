CREATE TABLE user_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    image_url VARCHAR(512) NOT NULL COMMENT '图片URL',
    image_info TEXT COMMENT '图片信息',
    image_size BIGINT UNSIGNED NOT NULL COMMENT '图片大小（字节）',
    image_hash VARCHAR(64) NOT NULL COMMENT '图片哈希值',
    view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
    like_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞次数',
    is_public TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否公开（1公开，0私有）',
    storage_provider VARCHAR(32) COMMENT '存储源头',
    is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '删除标记（0正常，1已删除）',
    tag_id BIGINT UNSIGNED COMMENT '标签ID',
    remark VARCHAR(255) COMMENT '备注',
    image_type VARCHAR(16) COMMENT '图片类型',
    UNIQUE KEY uq_image_hash (image_hash),
    INDEX idx_user_id (user_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户图床图片表'; 


CREATE TABLE system_info (
    `key` VARCHAR(64) PRIMARY KEY COMMENT '配置信息键',
    `value` TEXT COMMENT '配置信息值'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统信息表';





CREATE TABLE your_table_name (
    `key` VARCHAR(64) PRIMARY KEY COMMENT '键',
    `value` TEXT COMMENT '值',
    `createdTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updatedTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自定义配置信息表';