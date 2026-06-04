USE swift_wheels;

ALTER TABLE reservation_rental
  ADD COLUMN rental_date DATE NULL AFTER reservation_status,
  ADD COLUMN rental_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER rental_date,
  ADD COLUMN rental_status ENUM('not_started', 'active', 'returned', 'cancelled') NOT NULL DEFAULT 'not_started' AFTER rental_fee;

UPDATE reservation_rental
SET rental_date = start_date
WHERE rental_date IS NULL;
