-- ============================================================
-- Inkloom AI — Intelligent Brand Governance Platform
-- Master Database Schema Migration
-- PostgreSQL / Supabase Migration: 20261024_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Users (Linked to Supabase Auth or internal ID)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'brand_manager', 'reviewer', 'creator')) NOT NULL DEFAULT 'creator',
    avatar VARCHAR(255),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Brands
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(100) PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    tone_guidelines JSONB NOT NULL DEFAULT '{}'::jsonb,
    version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Brand Terminology Rules
CREATE TABLE IF NOT EXISTS brand_terminology_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id VARCHAR(100) REFERENCES brands(id) ON DELETE CASCADE,
    prohibited_term VARCHAR(255) NOT NULL,
    approved_alternative VARCHAR(255) NOT NULL,
    rule_reason TEXT,
    category VARCHAR(50) DEFAULT 'product_naming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Approved Facts & Verification Repository
CREATE TABLE IF NOT EXISTS approved_facts (
    id VARCHAR(100) PRIMARY KEY,
    brand_id VARCHAR(100) REFERENCES brands(id) ON DELETE CASCADE,
    fact_text TEXT NOT NULL,
    source_reference VARCHAR(500) NOT NULL,
    valid_from DATE,
    valid_until DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Brand Assets
CREATE TABLE IF NOT EXISTS brand_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id VARCHAR(100) REFERENCES brands(id) ON DELETE CASCADE,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    url_or_value TEXT NOT NULL,
    rules TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Content Submissions
CREATE TABLE IF NOT EXISTS content_submissions (
    id VARCHAR(100) PRIMARY KEY,
    brand_id VARCHAR(100) REFERENCES brands(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    original_content TEXT NOT NULL,
    current_content TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('draft', 'submitted_for_review', 'in_review', 'changes_requested', 'resubmitted', 'approved', 'rejected', 'archived')) DEFAULT 'submitted_for_review',
    assigned_reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Review Results
CREATE TABLE IF NOT EXISTS review_results (
    id VARCHAR(100) PRIMARY KEY,
    submission_id VARCHAR(100) REFERENCES content_submissions(id) ON DELETE CASCADE,
    model_provider VARCHAR(50) NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    overall_indicator INTEGER CHECK (overall_indicator >= 0 AND overall_indicator <= 100) NOT NULL,
    analysis_status VARCHAR(50) DEFAULT 'completed',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Findings
CREATE TABLE IF NOT EXISTS findings (
    id VARCHAR(100) PRIMARY KEY,
    review_result_id VARCHAR(100) REFERENCES review_results(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('high', 'medium', 'low')) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT NOT NULL,
    original_text TEXT NOT NULL,
    suggested_text TEXT NOT NULL,
    guideline_reference VARCHAR(500),
    evidence_reference VARCHAR(500),
    verification_status VARCHAR(50) CHECK (verification_status IN ('confirmed_conflict', 'unsupported_claim', 'uncertain_finding')) NOT NULL,
    resolution_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Content Versions
CREATE TABLE IF NOT EXISTS content_versions (
    id VARCHAR(100) PRIMARY KEY,
    submission_id VARCHAR(100) REFERENCES content_submissions(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Comments (Review collaboration)
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(100) PRIMARY KEY,
    submission_id VARCHAR(100) REFERENCES content_submissions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Approvals
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(100) PRIMARY KEY,
    submission_id VARCHAR(100) REFERENCES content_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    decision VARCHAR(50) CHECK (decision IN ('approved', 'changes_requested', 'rejected')) NOT NULL,
    decision_reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    resource_title VARCHAR(500),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- Row-Level Security (RLS) Policies
-- ============================================================

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow reading brands and submissions
CREATE POLICY "Allow public read for demo" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public read for submissions" ON content_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public read for review_results" ON review_results FOR SELECT USING (true);
CREATE POLICY "Allow public read for findings" ON findings FOR SELECT USING (true);
CREATE POLICY "Allow public read for audit_logs" ON audit_logs FOR SELECT USING (true);

-- Indexing for high-performance querying
CREATE INDEX IF NOT EXISTS idx_submissions_brand_id ON content_submissions(brand_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON content_submissions(status);
CREATE INDEX IF NOT EXISTS idx_findings_review_id ON findings(review_result_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
