-- ============================================================
-- HORNETS TAEKWONDO - CATANZARO
-- Schema Database PostgreSQL
-- ============================================================

-- Estensione per UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE livello_corso AS ENUM ('bambini', 'ragazzi', 'adulti', 'agonisti', 'master');
CREATE TYPE giorno_settimana AS ENUM ('lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica');
CREATE TYPE media_type AS ENUM ('foto', 'video');
CREATE TYPE stato_iscrizione AS ENUM ('attiva', 'sospesa', 'scaduta', 'in_attesa');
CREATE TYPE stato_contatto AS ENUM ('nuovo', 'letto', 'risposto', 'archiviato');
CREATE TYPE tipo_cintura AS ENUM (
  'bianca', 'gialla', 'arancione', 'verde', 'blu',
  'rossa', 'nera_1dan', 'nera_2dan', 'nera_3dan', 'nera_4dan_+'
);

-- ============================================================
-- TABELLA: admin_users
-- Utenti con accesso al backoffice
-- ============================================================

CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt cost 12
  nome          VARCHAR(100) NOT NULL,
  cognome       VARCHAR(100) NOT NULL,
  ruolo         VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'superadmin' | 'editor'
  avatar_url    TEXT,
  ultimo_accesso TIMESTAMPTZ,
  refresh_token_hash VARCHAR(255),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELLA: sito_config
-- Configurazioni generali del sito (key-value)
-- ============================================================

CREATE TABLE sito_config (
  chiave        VARCHAR(100) PRIMARY KEY,
  valore        TEXT,
  tipo          VARCHAR(20) NOT NULL DEFAULT 'text', -- 'text' | 'json' | 'boolean' | 'number'
  descrizione   TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by    UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Dati iniziali configurazione
INSERT INTO sito_config (chiave, valore, tipo, descrizione) VALUES
  ('hero_titolo', 'Hornets Taekwondo', 'text', 'Titolo principale Hero Section'),
  ('hero_sottotitolo', 'Disciplina. Forza. Rispetto.', 'text', 'Sottotitolo Hero'),
  ('hero_cta_text', 'Prenota Prova Gratuita', 'text', 'Testo bottone Hero CTA'),
  ('hero_video_url', '/videos/hero-bg.mp4', 'text', 'URL video background Hero'),
  ('chi_siamo_testo', 'Gli Hornets Taekwondo nascono a Catanzaro con la missione di...', 'text', 'Testo sezione Chi Siamo'),
  ('indirizzo', 'Via Roma 1, 88100 Catanzaro CZ', 'text', 'Indirizzo palestra'),
  ('telefono', '+39 0961 000000', 'text', 'Numero di telefono'),
  ('email_contatti', 'info@hornets-taekwondo.it', 'text', 'Email contatti pubblici'),
  ('instagram_url', 'https://instagram.com/hornets_taekwondo_cz', 'text', 'URL Instagram'),
  ('facebook_url', 'https://facebook.com/hornetstaekwondo', 'text', 'URL Facebook'),
  ('google_maps_embed', '', 'text', 'URL embed Google Maps'),
  ('meta_description', 'Hornets Taekwondo Catanzaro - Palestra di Taekwondo per bambini, adulti e agonisti.', 'text', 'Meta description SEO');

-- ============================================================
-- TABELLA: maestri
-- Profili dei maestri e istruttori
-- ============================================================

CREATE TABLE maestri (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(100) NOT NULL,
  cognome       VARCHAR(100) NOT NULL,
  titolo        VARCHAR(150),          -- es. "Maestro IV Dan WTF"
  bio           TEXT,
  foto_url      TEXT,
  cintura       tipo_cintura,
  dan           SMALLINT CHECK (dan BETWEEN 1 AND 9),
  anni_esperienza SMALLINT,
  specializzazione TEXT,
  ordine        SMALLINT NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELLA: corsi
-- Corsi offerti dalla palestra
-- ============================================================

CREATE TABLE corsi (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          VARCHAR(200) NOT NULL,
  livello       livello_corso NOT NULL,
  descrizione   TEXT,
  descrizione_breve VARCHAR(500),
  eta_min       SMALLINT,
  eta_max       SMALLINT,
  prezzo_mensile NUMERIC(8,2),
  prezzo_trimestrale NUMERIC(8,2),
  prezzo_annuale NUMERIC(8,2),
  foto_copertina TEXT,
  icona         VARCHAR(50),           -- es. 'shield', 'star', 'trophy'
  colore_tema   VARCHAR(7),            -- es. '#F5A623'
  ordine        SMALLINT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELLA: orari_corsi
-- Orari settimanali per ogni corso
-- ============================================================

CREATE TABLE orari_corsi (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corso_id      UUID NOT NULL REFERENCES corsi(id) ON DELETE CASCADE,
  giorno        giorno_settimana NOT NULL,
  ora_inizio    TIME NOT NULL,
  ora_fine      TIME NOT NULL,
  sala          VARCHAR(100),
  maestro_id    UUID REFERENCES maestri(id) ON DELETE SET NULL,
  note          TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELLA: galleria
-- Foto e video della palestra
-- ============================================================

CREATE TABLE galleria (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titolo        VARCHAR(255),
  descrizione   TEXT,
  tipo          media_type NOT NULL DEFAULT 'foto',
  url           TEXT NOT NULL,         -- path locale o URL CDN
  thumbnail_url TEXT,
  alt_text      VARCHAR(255),
  categoria     VARCHAR(100),          -- es. 'allenamenti', 'gare', 'eventi'
  dimensione_bytes BIGINT,
  larghezza     INTEGER,
  altezza       INTEGER,
  ordine        SMALLINT NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by   UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_galleria_categoria ON galleria(categoria);
CREATE INDEX idx_galleria_tipo ON galleria(tipo);
CREATE INDEX idx_galleria_visible ON galleria(is_visible);

-- ============================================================
-- TABELLA: news
-- Notizie e aggiornamenti
-- ============================================================

CREATE TABLE news (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titolo        VARCHAR(500) NOT NULL,
  slug          VARCHAR(500) NOT NULL UNIQUE,
  contenuto     TEXT NOT NULL,
  estratto      VARCHAR(1000),
  foto_copertina TEXT,
  tags          TEXT[],                -- Array di tag
  is_published  BOOLEAN NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  autore_id     UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(is_published, published_at DESC);

-- ============================================================
-- TABELLA: iscritti
-- Anagrafica iscritti/atleti
-- ============================================================

CREATE TABLE iscritti (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome            VARCHAR(100) NOT NULL,
  cognome         VARCHAR(100) NOT NULL,
  email           VARCHAR(255) UNIQUE,
  telefono        VARCHAR(20),
  data_nascita    DATE,
  codice_fiscale  VARCHAR(16) UNIQUE,
  indirizzo       TEXT,
  citta           VARCHAR(100),
  cap             VARCHAR(10),
  cintura_attuale tipo_cintura DEFAULT 'bianca',
  dan_attuale     SMALLINT DEFAULT 0,
  stato           stato_iscrizione NOT NULL DEFAULT 'in_attesa',
  corso_id        UUID REFERENCES corsi(id) ON DELETE SET NULL,
  data_iscrizione DATE,
  data_scadenza   DATE,
  note            TEXT,
  consenso_gdpr   BOOLEAN NOT NULL DEFAULT false,
  consenso_foto   BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_iscritti_stato ON iscritti(stato);
CREATE INDEX idx_iscritti_corso ON iscritti(corso_id);
CREATE INDEX idx_iscritti_scadenza ON iscritti(data_scadenza);

-- ============================================================
-- TABELLA: prenotazioni_prova
-- Richieste di prova gratuita dal sito
-- ============================================================

CREATE TABLE prenotazioni_prova (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        VARCHAR(100) NOT NULL,
  cognome     VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  telefono    VARCHAR(20),
  eta         SMALLINT,
  corso_id    UUID REFERENCES corsi(id) ON DELETE SET NULL,
  messaggio   TEXT,
  data_preferita DATE,
  stato       VARCHAR(50) NOT NULL DEFAULT 'nuova', -- 'nuova' | 'confermata' | 'completata' | 'annullata'
  note_admin  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prenotazioni_stato ON prenotazioni_prova(stato);

-- ============================================================
-- TABELLA: messaggi_contatto
-- Messaggi dal form contatti
-- ============================================================

CREATE TABLE messaggi_contatto (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        VARCHAR(200) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  telefono    VARCHAR(20),
  oggetto     VARCHAR(500),
  messaggio   TEXT NOT NULL,
  ip_address  INET,
  user_agent  TEXT,
  stato       stato_contatto NOT NULL DEFAULT 'nuovo',
  note_admin  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messaggi_stato ON messaggi_contatto(stato);
CREATE INDEX idx_messaggi_created ON messaggi_contatto(created_at DESC);

-- ============================================================
-- TABELLA: audit_log
-- Log delle azioni admin per sicurezza
-- ============================================================

CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  azione      VARCHAR(100) NOT NULL,  -- es. 'login', 'update_corso', 'delete_foto'
  tabella     VARCHAR(100),
  record_id   TEXT,
  dati_prima  JSONB,
  dati_dopo   JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ============================================================
-- TRIGGER: updated_at automatico
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_admin_users
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_corsi
  BEFORE UPDATE ON corsi
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_galleria
  BEFORE UPDATE ON galleria
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_news
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_iscritti
  BEFORE UPDATE ON iscritti
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_maestri
  BEFORE UPDATE ON maestri
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- DATI SEED: Corsi iniziali
-- ============================================================

INSERT INTO corsi (nome, livello, descrizione_breve, eta_min, eta_max, prezzo_mensile, colore_tema, ordine) VALUES
  ('Taekwondo Bambini', 'bambini',
   'Percorso pensato per i più piccoli: coordinazione, disciplina e divertimento attraverso il Taekwondo.',
   4, 11, 45.00, '#F5A623', 1),
  ('Taekwondo Ragazzi', 'ragazzi',
   'Tecnica e agonismo per ragazzi che vogliono crescere nel Taekwondo con allenamenti progressivi.',
   12, 17, 50.00, '#D0021B', 2),
  ('Taekwondo Adulti', 'adulti',
   'Allenamenti completi per adulti: forma fisica, autodifesa e crescita personale.',
   18, 99, 55.00, '#1A1A1A', 3),
  ('Agonismo & Competizione', 'agonisti',
   'Preparazione atletica avanzata per atleti che vogliono competere a livello regionale e nazionale.',
   14, 35, 70.00, '#F5A623', 4);
