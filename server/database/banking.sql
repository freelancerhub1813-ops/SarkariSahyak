USE sarkar_sahyka;

-- =======================================
-- Safely delete existing data from 'schemes' table
-- =======================================
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM schemes;
ALTER TABLE schemes AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================
-- Insert Banking & Financial Schemes
-- =======================================

-- 1. Pradhan Mantri Mudra Yojana (PMMY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Mudra Yojana (PMMY)',
  'Banking',
  'Provides micro credit loans up to ₹20 lakh to non-corporate, non-farm small/micro enterprises.',
  'To promote entrepreneurship and provide financial support to small businesses.',
  'Loans up to ₹20 lakh; no collateral required.',
  'Individuals or entities engaged in income-generating activities.',
  'Aadhaar Card, Business Proof, Bank Account Details'
);

-- 2. Pradhan Mantri Jan Dhan Yojana (PMJDY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
  'Banking',
  'Aims to provide universal access to banking facilities to every household.',
  'To ensure financial inclusion and access to banking services.',
  'Zero balance savings account, RuPay debit card, accidental insurance cover.',
  'All Indian citizens, especially those without a bank account.',
  'Aadhaar Card, Address Proof, Passport-size Photograph'
);

-- 3. Stand-Up India Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Stand-Up India Scheme',
  'Banking',
  'Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.',
  'To promote entrepreneurship among SC/ST and women borrowers.',
  'Loan between ₹10 lakh and ₹1 crore; 25% margin money subsidy.',
  'SC/ST and women entrepreneurs above 18 years of age.',
  'Aadhaar Card, Caste Certificate, Business Plan'
);

-- 4. Kisan Credit Card (KCC)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Kisan Credit Card (KCC)',
  'Banking ',
  'Provides adequate and timely credit support from the banking system under a single window.',
  'To meet the short-term credit requirements of farmers.',
  'Overdraft facility, low-interest rates, insurance coverage.',
  'Farmers engaged in agriculture and allied activities.',
  'Aadhaar Card, Land Ownership Proof, Bank Account Details'
);

-- 5. Credit Linked Subsidy Scheme (CLSS) for Middle Income Group
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Credit Linked Subsidy Scheme (CLSS) for Middle Income Group',
  'Banking ',
  'Provides interest subsidy on home loans for middle-income groups.',
  'To promote affordable housing for the middle-income segment.',
  'Interest subsidy up to 6.5% on home loans.',
  'Individuals with annual income between ₹6 lakh and ₹18 lakh.',
  'Aadhaar Card, Income Proof, Property Documents'
);

-- 6. Skill Loan Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Skill Loan Scheme',
  'Banking ',
  'Provides loans for skill development courses from recognized institutions.',
  'To promote skill development and enhance employability.',
  'Loan amount up to ₹1.5 lakh; repayment tenure up to 5 years.',
  'Individuals pursuing skill development courses.',
  'Aadhaar Card, Admission Proof, Bank Account Details'
);

-- 7. Higher Education and Skill Development Guarantee Scheme (HESDGS)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Higher Education and Skill Development Guarantee Scheme (HESDGS)',
  'Banking ',
  'Provides financial support for higher education and skill development.',
  'To promote higher education and skill development among youth.',
  'Loan amount up to ₹10 lakh for higher education; up to ₹1.5 lakh for skill development.',
  'Indian citizens pursuing higher education or skill development.',
  'Aadhaar Card, Admission Proof, Income Proof'
);

-- 8. Mahila Samman Savings Certificate
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Mahila Samman Savings Certificate',
  'Banking ',
  'Provides financial security to every woman and girl.',
  'To promote financial inclusion and security for women.',
  'Fixed interest rate; partial withdrawal allowed.',
  'Women and girls above 18 years of age.',
  'Aadhaar Card, Address Proof, Passport-size Photograph'
);

-- 9. Bank Tie-Up Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Bank Tie-Up Scheme',
  'Banking ',
  'Arranges loans through banks for Scheduled Castes.',
  'To provide financial assistance to Scheduled Castes.',
  'Loan facilities through tie-up with banks.',
  'Scheduled Castes individuals or entities.',
  'Aadhaar Card, Caste Certificate, Bank Account Details'
);

-- 10. Stand-Up India Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Stand-Up India Scheme',
  'Banking ',
  'Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.',
  'To promote entrepreneurship among SC/ST and women borrowers.',
  'Loan between ₹10 lakh and ₹1 crore; 25% margin money subsidy.',
  'SC/ST and women entrepreneurs above 18 years of age.',
  'Aadhaar Card, Caste Certificate, Business Plan'
);