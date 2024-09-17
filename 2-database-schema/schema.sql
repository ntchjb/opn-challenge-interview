CREATE TABLE customers (
	id INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(256) NOT NULL,
	hashed_password CHAR(60) NOT NULL,
	name VARCHAR(512) NOT NULL,
	dob DATETIME NOT NULL,
	location POINT NOT NULL,
	
	UNIQUE (email)
);

CREATE TABLE categories (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(256) NOT NULL,
	color INT NOT NULL, -- Color as 8-bit RBGA
	icon_url VARCHAR(1024) NULL,
	is_hide BOOL NOT NULL,
	created_at DATETIME NOT NULL,
	
	INDEX categories_is_hide_name_idx (is_hide, name)
);

CREATE TABLE products (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(1024) NOT NULL,
	image_url VARCHAR(1024) NULL,
	category_id INT NULL,

	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,

	INDEX products_updated_at_idx (deleted_at, updated_at),
	INDEX products_category_id_idx (category_id, deleted_at, updated_at),
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION
	-- foreign key is set to prevent category deletion if there are products in there,
	-- so use is_hide instead to hide category and its products
	-- then use batch data migration to migrate all products to desired category
);

CREATE TABLE product_variants (
	id INT PRIMARY KEY AUTO_INCREMENT,
	product_id INT NOT NULL,
	name VARCHAR(1024) NOT NULL,
	remaining_items INT NOT NULL DEFAULT 0,

	INDEX product_variants_product_id_idx (product_id),
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE customer_carts (
	id INT PRIMARY KEY AUTO_INCREMENT,
	customer_id INT NOT NULL,
	product_variant_id INT NOT NULL,
	count INT NOT NULL DEFAULT 1,

	INDEX customer_carts_customer_id_product_variant_id_idx (customer_id, product_variant_id),
	FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
	-- No foreign key for product_variant_id to prevent mass updates
	-- when a product is deleted, and there are many customers put that product in their cart.
);
