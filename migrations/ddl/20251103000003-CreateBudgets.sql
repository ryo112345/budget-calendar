
-- +migrate Up
CREATE TABLE IF NOT EXISTS budgets(
	id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_id BIGINT NOT NULL,
	category_id BIGINT NOT NULL,
	amount INT NOT NULL,
	month VARCHAR(7) NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME,
	INDEX idx_user_id (user_id),
	INDEX idx_category_id (category_id),
	INDEX idx_month (month),
	UNIQUE KEY uk_user_category_month (user_id, category_id, month),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- +migrate Down
DROP TABLE IF EXISTS budgets;
