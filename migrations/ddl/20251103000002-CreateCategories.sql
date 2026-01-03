
-- +migrate Up
CREATE TABLE IF NOT EXISTS categories(
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id BIGINT NOT NULL,
	name VARCHAR(100) NOT NULL,
	type ENUM('income', 'expense') NOT NULL,
	color VARCHAR(20),
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	INDEX idx_user_id (user_id),
	INDEX idx_type (type),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- +migrate Down
DROP TABLE IF EXISTS categories;
