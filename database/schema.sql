CREATE DATABASE IF NOT EXISTS fpg_properties
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fpg_properties;

CREATE TABLE IF NOT EXISTS properties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    map_embed_url TEXT NULL,
    type VARCHAR(100) NOT NULL,
    company VARCHAR(20) NOT NULL DEFAULT 'FPG',
    description TEXT NULL,
    total_blocks INT UNSIGNED NOT NULL DEFAULT 0,
    total_units INT UNSIGNED NOT NULL DEFAULT 0,
    units_sold INT UNSIGNED NOT NULL DEFAULT 0,
    units_available INT UNSIGNED NOT NULL DEFAULT 0,
    welcome_text TEXT NULL,
    about_text TEXT NULL,
    main_image TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_properties_company (company),
    INDEX idx_properties_type (type),
    INDEX idx_properties_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS property_galleries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT UNSIGNED NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_property_galleries_property_id (property_id),
    CONSTRAINT fk_property_galleries_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    inquiry_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    provider_message_id VARCHAR(255) NULL,
    email_error VARCHAR(500) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    replied_at DATETIME NULL,
    INDEX idx_contacts_created_at (created_at),
    INDEX idx_contacts_email (email),
    INDEX idx_contacts_status (status, created_at),
    INDEX idx_contacts_rate_limit (ip_address, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS awards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(20) NULL,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_awards_display_order (display_order, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS news (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NULL,
    summary TEXT NULL,
    location VARCHAR(255) NULL,
    published_at DATE NULL,
    cover_image TEXT NULL,
    content_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_news_published_at (published_at, id),
    INDEX idx_news_category (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS company_recaps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id VARCHAR(20) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    total_komplek INT UNSIGNED NOT NULL DEFAULT 0,
    total_rumah INT UNSIGNED NOT NULL DEFAULT 0,
    total_terjual INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_company_recaps_company_id (company_id),
    INDEX idx_company_recaps_display_order (display_order, company_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    security_question VARCHAR(255) NULL,
    security_answer VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_users_username (username),
    UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_reset_lookup (email, otp, used, expires_at),
    INDEX idx_password_reset_user_created (user_id, created_at),
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES admin_users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO company_recaps
    (company_id, company_name, display_order, total_komplek, total_rumah, total_terjual)
VALUES
    ('FPG', 'Fachri Property Group', 1, 0, 0, 0),
    ('FPL', 'Fachri Property Land', 2, 0, 0, 0)
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    display_order = VALUES(display_order);
