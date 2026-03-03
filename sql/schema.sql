-- TVS Alwar Showroom – Database Schema
-- Run this first in your Supabase SQL Editor

-- ── Reps ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reps (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    emoji        TEXT DEFAULT '👤',
    monthly_target INTEGER DEFAULT 0,
    active       BOOLEAN DEFAULT true,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Vehicles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
    id       SERIAL PRIMARY KEY,
    brand    TEXT NOT NULL,
    model    TEXT NOT NULL,
    category TEXT NOT NULL,
    active   BOOLEAN DEFAULT true
);

-- ── Variants ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS variants (
    id                 SERIAL PRIMARY KEY,
    vehicle_id         INTEGER REFERENCES vehicles(id),
    name               TEXT NOT NULL,
    ex_showroom_price  INTEGER NOT NULL,  -- in paise
    engine_cc          INTEGER,
    fuel_type          TEXT DEFAULT 'petrol',
    active             BOOLEAN DEFAULT true
);

-- ── Accessories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accessories (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    category      TEXT NOT NULL,
    default_price INTEGER NOT NULL,  -- in paise
    is_mandatory  BOOLEAN DEFAULT false,
    active        BOOLEAN DEFAULT true
);

-- ── Finance Companies ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_companies (
    id     SERIAL PRIMARY KEY,
    name   TEXT NOT NULL,
    active BOOLEAN DEFAULT true
);

-- ── Quotations ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotations (
    id                     SERIAL PRIMARY KEY,
    quote_number           TEXT UNIQUE,
    invoice_number         TEXT UNIQUE,
    rep_id                 INTEGER REFERENCES reps(id),
    customer_name          TEXT NOT NULL,
    customer_phone         TEXT NOT NULL,
    customer_address       TEXT NOT NULL,
    variant_id             INTEGER REFERENCES variants(id),
    ex_showroom_price      INTEGER NOT NULL,
    road_tax_rate          NUMERIC NOT NULL,
    road_tax_amount        INTEGER NOT NULL,
    registration_fee       INTEGER DEFAULT 40000,
    hsrp_charges           INTEGER DEFAULT 45000,
    smart_card_rc          INTEGER DEFAULT 20000,
    fasstag                INTEGER DEFAULT 50000,
    insurance_premium      INTEGER DEFAULT 0,
    insurance_company      TEXT,
    insurance_years        INTEGER DEFAULT 1,
    hypothecation_charges  INTEGER DEFAULT 0,
    finance_company_id     INTEGER REFERENCES finance_companies(id),
    extended_warranty_price INTEGER DEFAULT 0,
    extended_warranty_years INTEGER DEFAULT 0,
    accessories_total      INTEGER DEFAULT 0,
    gross_amount           INTEGER NOT NULL,
    discount_amount        INTEGER DEFAULT 0,
    discount_reason        TEXT,
    final_amount           INTEGER NOT NULL,
    payment_mode           TEXT,
    upi_reference          TEXT,
    finance_reference      TEXT,
    status                 TEXT DEFAULT 'pending_approval',
    rejection_reason       TEXT,
    submitted_at           TIMESTAMPTZ DEFAULT NOW(),
    approved_at            TIMESTAMPTZ,
    paid_at                TIMESTAMPTZ,
    busy_exported_at       TIMESTAMPTZ,
    created_at             TIMESTAMPTZ DEFAULT NOW(),
    updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quotation Accessories ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_accessories (
    id              SERIAL PRIMARY KEY,
    quotation_id    INTEGER REFERENCES quotations(id) ON DELETE CASCADE,
    accessory_id    INTEGER REFERENCES accessories(id),
    name            TEXT NOT NULL,
    price_at_time   INTEGER NOT NULL  -- in paise
);

-- ── Payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                SERIAL PRIMARY KEY,
    quotation_id      INTEGER REFERENCES quotations(id),
    amount            INTEGER NOT NULL,  -- in paise
    payment_mode      TEXT NOT NULL,
    upi_reference     TEXT,
    finance_company_id INTEGER REFERENCES finance_companies(id),
    finance_reference TEXT,
    collected_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_quotations_updated_at ON quotations;
CREATE TRIGGER trg_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
