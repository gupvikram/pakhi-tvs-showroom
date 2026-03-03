-- TVS Alwar Showroom – Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- All prices stored in PAISE (rupees × 100)

-- ── Reps ──────────────────────────────────────────────────────────────────────
INSERT INTO reps (name, emoji, monthly_target) VALUES
    ('Sales Representative 1', '👨‍💼', 20),
    ('Sales Representative 2', '👩‍💼', 20),
    ('Sales Representative 3', '👨‍💼', 20),
    ('Sales Representative 4', '👩‍💼', 20);

-- ── Finance Companies ─────────────────────────────────────────────────────────
INSERT INTO finance_companies (name) VALUES
    ('Bajaj Finance'),
    ('ICICI Bank'),
    ('Kotak Mahindra Bank'),
    ('TVS Credit Services'),
    ('HDFC Bank');

-- ── Vehicles ──────────────────────────────────────────────────────────────────
-- Commuter Motorcycles
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Sport', 'Commuter Motorcycle');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Radeon', 'Commuter Motorcycle');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Star City+', 'Commuter Motorcycle');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Raider 125', 'Commuter Motorcycle');
-- Roadster
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Ronin', 'Roadster');
-- Sports
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Apache RTR 160 4V', 'Sports Motorcycle');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Apache RTR 200 4V', 'Sports Motorcycle');
-- Adventure
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Apache RTX 300', 'Adventure');
-- Premium Sports
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Apache RR 310', 'Premium Sports');
-- Moped
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'XL100', 'Moped');
-- Scooters
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Zest 110', 'Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Jupiter 110', 'Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Jupiter 125', 'Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Ntorq 125', 'Sports Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Ntorq 150', 'Sports Scooter');
-- Electric
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'Orbiter', 'Electric Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'iQube', 'Electric Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'iQube S', 'Electric Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'iQube ST', 'Electric Scooter');
INSERT INTO vehicles (brand, model, category) VALUES ('TVS', 'X', 'Electric Scooter');

-- ── Variants ──────────────────────────────────────────────────────────────────
-- TVS Sport (vehicle_id=1)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (1, 'Standard',     5540000, 100, 'petrol'),
    (1, 'Double Seat',  5710000, 100, 'petrol');

-- TVS Radeon (vehicle_id=2)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (2, 'Drum', 6800000, 110, 'petrol'),
    (2, 'Disc', 7350000, 110, 'petrol');

-- TVS Star City+ (vehicle_id=3)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (3, 'Drum', 8200000, 110, 'petrol'),
    (3, 'Disc', 8750000, 110, 'petrol');

-- TVS Raider 125 (vehicle_id=4)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (4, 'Drum',     8200000, 125, 'petrol'),
    (4, 'Disc',     9000000, 125, 'petrol'),
    (4, 'Disc ABS', 9705000, 125, 'petrol');

-- TVS Ronin (vehicle_id=5)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (5, 'Single Channel ABS', 12569000, 225, 'petrol'),
    (5, 'Dual Channel ABS',   14200000, 225, 'petrol');

-- TVS Apache RTR 160 4V (vehicle_id=6)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (6, 'Single Disc',      11219000, 160, 'petrol'),
    (6, 'Double Disc ABS',  12700000, 160, 'petrol');

-- TVS Apache RTR 200 4V (vehicle_id=7)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (7, 'Single ABS', 14200000, 200, 'petrol'),
    (7, 'Dual ABS',   15000000, 200, 'petrol');

-- TVS Apache RTX 300 (vehicle_id=8)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (8, 'Standard', 19900000, 300, 'petrol'),
    (8, 'BTO',      22900000, 300, 'petrol');

-- TVS Apache RR 310 (vehicle_id=9)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (9, 'Standard', 31064000, 310, 'petrol');

-- TVS XL100 (vehicle_id=10)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (10, 'Comfort',    4390000, 100, 'petrol'),
    (10, 'Heavy Duty', 4750000, 100, 'petrol');

-- TVS Zest 110 (vehicle_id=11)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (11, 'Drum', 7060000, 110, 'petrol'),
    (11, 'Disc', 7600000, 110, 'petrol');

-- TVS Jupiter 110 (vehicle_id=12)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (12, 'Drum',            7340000, 110, 'petrol'),
    (12, 'Disc',            8200000, 110, 'petrol'),
    (12, 'Special Edition', 8800000, 110, 'petrol');

-- TVS Jupiter 125 (vehicle_id=13)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (13, 'Drum', 8400000, 125, 'petrol'),
    (13, 'Disc', 9200000, 125, 'petrol');

-- TVS Ntorq 125 (vehicle_id=14)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (14, 'Drum',    8600000, 125, 'petrol'),
    (14, 'Disc',    9500000, 125, 'petrol'),
    (14, 'Race XP', 10500000, 125, 'petrol');

-- TVS Ntorq 150 (vehicle_id=15)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (15, 'Standard',     11000000, 150, 'petrol'),
    (15, 'Race Edition', 11800000, 150, 'petrol');

-- TVS Orbiter (vehicle_id=16)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (16, 'Standard', 9999000, 0, 'electric');

-- TVS iQube (vehicle_id=17)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (17, 'Standard 2.2kWh', 8499900, 0, 'electric');

-- TVS iQube S (vehicle_id=18)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (18, '3.5kWh', 12000000, 0, 'electric');

-- TVS iQube ST (vehicle_id=19)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (19, '5.1kWh', 16198400, 0, 'electric');

-- TVS X (vehicle_id=20)
INSERT INTO variants (vehicle_id, name, ex_showroom_price, engine_cc, fuel_type) VALUES
    (20, 'Standard', 24990000, 0, 'electric');

-- ── Accessories ───────────────────────────────────────────────────────────────
INSERT INTO accessories (name, category, default_price, is_mandatory) VALUES
    ('Helmet - Half Face ISI',    'Safety',            100000, false),
    ('Helmet - Full Face ISI',    'Safety',            200000, false),
    ('Riding Gloves',             'Safety',             50000, false),
    ('Saree Guard',               'Guards',             60000, false),
    ('Leg Guard / Crash Guard',   'Guards',            100000, false),
    ('Knuckle Guard',             'Guards',             50000, false),
    ('Seat Cover',                'Comfort and Style',  60000, false),
    ('Vehicle Body Cover',        'Comfort and Style',  75000, false),
    ('Floor Mat',                 'Comfort and Style',  30000, false),
    ('Mobile Holder',             'Comfort and Style',  50000, false),
    ('USB Charger',               'Comfort and Style',  55000, false),
    ('Carrier / Luggage Box',     'Functional',        150000, false),
    ('Alarm / Anti-theft Lock',   'Functional',        100000, false),
    ('Side Stand Extender',       'Functional',         25000, false),
    ('FASTag',                    'Mandatory',          50000, true);
