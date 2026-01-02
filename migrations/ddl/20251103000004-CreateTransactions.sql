
-- +migrate Up
CREATE TABLE IF NOT EXISTS transactions(
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id BIGINT NOT NULL,
	category_id BIGINT NOT NULL,
	type VARCHAR(10) NOT NULL,
	amount INT NOT NULL,
	date DATETIME NOT NULL,
	description VARCHAR(255),
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	INDEX idx_user_id (user_id),
	INDEX idx_category_id (category_id),
	INDEX idx_date (date),
	INDEX idx_type (type),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
	CHECK (type IN ('income', 'expense')),
	CHECK (amount >= 0)
);

-- +migrate Down
DROP TABLE IF EXISTS transactions;
