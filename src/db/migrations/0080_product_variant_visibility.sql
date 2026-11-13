-- A variant the merchant stops selling without deleting it. A variant already
-- on an order cannot be deleted (order_items keeps pointing at it), so before
-- this column the only way to take one off the storefront was to deactivate
-- the whole product. Off: absent from every storefront page, form, feed and
-- the Headless catalogue, and refused at checkout; order history, admin,
-- exports and dispatch still read it.
ALTER TABLE `product_variants` ADD COLUMN `is_active` integer DEFAULT 1 NOT NULL;
