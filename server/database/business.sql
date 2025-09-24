USE sarkar_sahyka;

-- =======================================
-- Insert Business & Entrepreneurship Schemes
-- =======================================

-- 1. Pradhan Mantri Mudra Yojana (PMMY)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Mudra Yojana (PMMY)',
  'Business ',
  'Provides micro-credit loans up to ₹20 lakh to non-farm income-generating micro-enterprises.',
  'To promote entrepreneurship and facilitate easy access to credit for small businesses.',
  'Loans up to ₹20 lakh; three categories: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), Tarun (₹5,00,001 to ₹20 lakh).',
  'Non-farm income-generating micro-enterprises; individuals, proprietors, and partnerships.',
  'Aadhaar Card, Business Plan, Bank Account Details'
);

-- 2. Stand-Up India Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Stand-Up India Scheme',
  'Business ',
  'Facilitates bank loans between ₹10 lakh and ₹1 crore for setting up greenfield enterprises.',
  'To promote entrepreneurship among SC/ST and/or women entrepreneurs.',
  'Loans between ₹10 lakh and ₹1 crore; 75% of the project cost; 25% margin money.',
  'SC/ST and/or women entrepreneurs; age between 18 and 65 years.',
  'Aadhaar Card, Caste Certificate (if applicable), Bank Account Details'
);

-- 3. New Entrepreneur-cum-Enterprise Development Scheme (NEEDS)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'New Entrepreneur-cum-Enterprise Development Scheme (NEEDS)',
  'Business ',
  'Provides training to young first-generation entrepreneurs in conceiving, planning, initiating, and launching manufacturing or service enterprises.',
  'To develop entrepreneurship skills among youth and promote self-employment.',
  'Training programs; financial assistance for setting up enterprises.',
  'Young first-generation entrepreneurs; age between 18 and 45 years.',
  'Aadhaar Card, Bank Account Details, Educational Qualifications'
);

-- 4. Startup India Seed Fund Scheme (SISFS)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Startup India Seed Fund Scheme (SISFS)',
  'Business ',
  'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
  'To support early-stage startups and encourage innovation.',
  'Financial assistance up to ₹5 crore for eligible startups.',
  'Startups recognized by DPIIT; in operation for up to 5 years.',
  'DPIIT Recognition Certificate, Business Plan, Bank Account Details'
);

-- 5. Scheme for Assistance to Micro, Small and Medium Enterprises (MSME)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Scheme for Assistance to Micro, Small and Medium Enterprises (MSME)',
  'Business ',
  'Provides financial assistance for the development and modernization of MSMEs.',
  'To promote the growth and development of MSMEs.',
  'Financial assistance for technology upgradation, infrastructure development, and capacity building.',
  'Micro, Small, and Medium Enterprises; registered under MSME Act.',
  'MSME Registration Certificate, Project Report, Bank Account Details'
);

-- 6. Incubation Scheme under MSME Innovative Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Incubation Scheme under MSME Innovative Scheme',
  'Business',
  'Aims to promote and support untapped creativity and the adoption of the latest technologies in MSMEs.',
  'To foster innovation and technological advancement in MSMEs.',
  'Financial support for setting up incubation centers; mentoring and networking opportunities.',
  'MSMEs; institutions with innovative ideas and technologies.',
  'MSME Registration Certificate, Project Proposal, Bank Account Details'
);

-- 7. Green Business Scheme
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Green Business Scheme',
  'Business ',
  'Provides financial assistance to promote environmentally sustainable business practices.',
  'To encourage businesses to adopt green technologies and practices.',
  'Financial assistance for setting up green businesses; training and capacity building.',
  'Businesses engaged in environmentally sustainable activities.',
  'Aadhaar Card, Business Plan, Bank Account Details'
);

-- 8. Credit Guarantee Fund Scheme for Micro and Small Enterprises (CGTMSE)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Credit Guarantee Fund Scheme for Micro and Small Enterprises (CGTMSE)',
  'Business ',
  'Provides collateral-free credit to micro and small enterprises.',
  'To facilitate easy access to credit for MSMEs.',
  'Up to 85% credit guarantee coverage; no collateral required.',
  'Micro and Small Enterprises; registered under MSME Act.',
  'MSME Registration Certificate, Loan Application, Bank Account Details'
);

-- 9. Pradhan Mantri Employment Generation Programme (PMEGP)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Pradhan Mantri Employment Generation Programme (PMEGP)',
  'Business ',
  'Provides financial assistance to set up micro-enterprises in the non-farm sector.',
  'To generate employment opportunities in rural and urban areas.',
  'Subsidy up to 35% of the project cost; margin money assistance.',
  'Individuals, cooperatives, self-help groups, and institutions.',
  'Aadhaar Card, Project Report, Bank Account Details'
);

-- 10. Atal Innovation Mission (AIM)
INSERT INTO schemes (name, category, basic_info, objectives, benefits, eligibility, documents)
VALUES (
  'Atal Innovation Mission (AIM)',
  'Business ',
  'Aims to promote a culture of innovation and entrepreneurship in the country.',
  'To support the establishment of Atal Tinkering Labs and Atal Incubation Centers.',
  'Financial support for setting up innovation hubs; mentoring and networking opportunities.',
  'Educational institutions, startups, and other innovation-driven organizations.',
  'Aadhaar Card, Project Proposal, Bank Account Details'
);