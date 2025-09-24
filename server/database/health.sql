USE sarkar_sahyka;

-- =======================================
-- Insert Health Schemes
-- =======================================

-- 1. Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
  'Health',
  'Provides health insurance cover of ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
  'To provide financial protection to poor and vulnerable families for hospitalization expenses.',
  'Cashless treatment at empanelled hospitals; coverage for pre-existing conditions.',
  'Low-income families; eligible based on SECC data.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 2. Employee Health Scheme (EHSP)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Employee Health Scheme (EHSP)',
  'Health',
  'Provides cashless treatment to government employees, pensioners, and their dependents at empanelled hospitals.',
  'To offer comprehensive health coverage to government employees and their families.',
  'Cashless hospitalization; coverage for a wide range of medical treatments.',
  'Government employees, pensioners, and their dependents.',
  'Employee ID, Aadhaar Card, Bank Account Details'
);

-- 3. Mukhmantri Sehat Bima Yojana (MMSBY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Mukhmantri Sehat Bima Yojana (MMSBY)',
  'Health',
  'Provides cashless health insurance cover to families in Punjab.',
  'To offer financial protection against health-related expenses to families in Punjab.',
  'Cashless treatment at empanelled hospitals; coverage for a wide range of medical treatments.',
  'Residents of Punjab; families meeting eligibility criteria.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 4. Chief Minister\'s Comprehensive Health Insurance Scheme (CMCHIS)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Chief Minister\'s Comprehensive Health Insurance Scheme (CMCHIS)',
  'Health',
  'Offers cashless hospitalization for specific ailments/procedures with coverage up to ₹5,00,000 per family per year.',
  'To provide comprehensive health insurance coverage to families.',
  'Cashless treatment at empanelled hospitals; coverage for specific ailments.',
  'Families meeting eligibility criteria.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 5. Niramaya Health Insurance Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Niramaya Health Insurance Scheme',
  'Health',
  'Provides affordable health insurance up to ₹1,00,000 for persons with Autism, Cerebral Palsy, Mental Retardation, and Multiple Disabilities.',
  'To offer financial protection against health-related expenses for persons with disabilities.',
  'Coverage for medical treatments; cashless hospitalization.',
  'Persons with Autism, Cerebral Palsy, Mental Retardation, and Multiple Disabilities.',
  'Disability Certificate, Aadhaar Card, Bank Account Details'
);

-- 6. Goa Mediclaim Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Goa Mediclaim Scheme',
  'Health',
  'Provides financial assistance for super-speciality treatments not available in Government Hospitals of Goa.',
  'To offer financial support for patients requiring super-speciality treatments.',
  'Financial assistance for medical treatments; coverage for specific procedures.',
  'Residents of Goa; meeting eligibility criteria.',
  'Aadhaar Card, Medical Certificate, Bank Account Details'
);

-- 7. Andaman & Nicobar Islands Scheme for Health Insurance (ANISHI)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Andaman & Nicobar Islands Scheme for Health Insurance (ANISHI)',
  'Health',
  'Provides cashless medical treatment benefit up to ₹5.00 Lakhs per patient per illness to people belonging to Below Poverty Level/Priority Households.',
  'To provide financial protection against health-related expenses for underprivileged families.',
  'Cashless treatment at empanelled hospitals; coverage for a wide range of medical treatments.',
  'Residents of Andaman & Nicobar Islands; Below Poverty Level/Priority Households.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 8. Chief Minister\'s Health Insurance Scheme - Nagaland
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Chief Minister\'s Health Insurance Scheme - Nagaland',
  'Health',
  'Provides cashless treatment up to ₹20 lakhs for employees/pensioners and ₹5 lakhs for general category, covering inpatient and specific daycare procedures.',
  'To offer comprehensive health insurance coverage to residents of Nagaland.',
  'Cashless treatment at empanelled hospitals; coverage for specific ailments.',
  'Residents of Nagaland; meeting eligibility criteria.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 9. Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
  'Health',
  'Offers cashless treatment for identified diseases through a network of empanelled hospitals in Maharashtra.',
  'To provide financial protection against health-related expenses for residents of Maharashtra.',
  'Cashless treatment at empanelled hospitals; coverage for specific diseases.',
  'Residents of Maharashtra; meeting eligibility criteria.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);

-- 10. Pradhan Mantri Garib Kalyan Yojana (PMGKY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Garib Kalyan Yojana (PMGKY)',
  'Health',
  'Provides free food grains and cash transfers to low-income families during the COVID-19 pandemic.',
  'To support low-income families during the COVID-19 pandemic.',
  'Free food grains; cash transfers; coverage for health-related expenses.',
  'Low-income families; meeting eligibility criteria.',
  'Aadhaar Card, Ration Card, Bank Account Details'
);