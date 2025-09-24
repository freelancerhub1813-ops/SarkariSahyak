USE sarkar_sahyka;

-- =======================================
-- Existing data delete करायचं असल्यास (safe way)
-- =======================================
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM schemes;
ALTER TABLE schemes AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================
-- Insert Schemes (without manual id)
-- =======================================

-- 1. Pradhan Mantri Kisan Samman Nidhi
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Kisan Samman Nidhi',
  'Agriculture',
  'Central Govt scheme to support financial needs of landholding farmers’ families by providing direct income support.',
  'To supplement the financial needs of all landholding farmers for crop health, yields, and domestic needs. ₹6000/year released directly into bank accounts via DBT.',
  'Financial benefit of ₹6000 per annum per family, payable in 3 equal installments of ₹2000 every four months.',
  'All landholding farmers’ families with cultivable landholding in their names are eligible.',
  'Aadhaar Card, Landholding Papers, Savings Bank Account'
);

-- 2. Pradhan Mantri Adarsh Gram Yojana
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Adarsh Gram Yojana',
  'Agriculture',
  'Launched in 2009-10 for integrated development of Scheduled Caste majority villages.',
  'Enable area-based integrated development of SC-majority villages through convergence of schemes and gap-filling funds.',
  'Holistic village development, ₹20 lakh per village for infrastructure gaps, convergence of central/state schemes, improved social empowerment.',
  'Village with ≥50% SC population (≥40% in some states), ≥500 total population, recognized in Census data, not covered under earlier PMAGY phases.',
  'Village Development Plan (VDP), Bank Account Details of implementing agency, Committee details approved by Gram Panchayat, Baseline survey data'
);

-- 3. Pradhan Mantri Matsya Sampada Yojana (Ornamental Fish Rearing - Haryana)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Matsya Sampada Yojana - Medium Scale Ornamental Fish Rearing (Haryana)',
  'Agriculture',
  'Centrally sponsored scheme implemented by Fisheries Dept. Haryana to promote ornamental fish farming as livelihood.',
  'Promote sustainable ornamental fish rearing through financial assistance for sheds, breeding units, rearing/culture tanks.',
  'Project cost ₹8,00,000 per unit. Subsidy: 40% for General Category, 60% for SC/Women beneficiaries.',
  'Applicant must be resident of Haryana, have valid Family ID (PPP), own/lease 150 sq.m land with water facility for at least 7 years.',
  'Agreement letter, Birth certificate/ID proof, Caste certificate (if applicable), Fisheries training certificate, Land records/lease deed, Bills & Receipts, Beneficiary photo, Bank & PAN details, DPR/Proposal'
);
