USE fpg_properties;

ALTER TABLE contacts
    ADD COLUMN inquiry_type VARCHAR(50) NOT NULL DEFAULT 'umum' AFTER id,
    MODIFY COLUMN phone VARCHAR(50) NULL,
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'new' AFTER message,
    ADD COLUMN email_status VARCHAR(20) NOT NULL DEFAULT 'pending' AFTER status,
    ADD COLUMN provider_message_id VARCHAR(255) NULL AFTER email_status,
    ADD COLUMN email_error VARCHAR(500) NULL AFTER provider_message_id,
    ADD COLUMN ip_address VARCHAR(45) NULL AFTER email_error,
    ADD COLUMN user_agent VARCHAR(500) NULL AFTER ip_address,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
    ADD COLUMN read_at DATETIME NULL AFTER updated_at,
    ADD COLUMN replied_at DATETIME NULL AFTER read_at,
    ADD INDEX idx_contacts_status (status, created_at),
    ADD INDEX idx_contacts_rate_limit (ip_address, created_at);
