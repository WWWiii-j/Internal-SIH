import { SampleDataset } from '../types';

export const SAMPLE_CONSULTATION_DATASETS: SampleDataset[] = [
  {
    id: 'green_hydrogen',
    title: 'Draft National Green Hydrogen & Clean Ammonia Policy 2025',
    description:
      'Multi-stakeholder e-consultation on 25-year transmission waivers, SIGHT capital subsidies, water safety standards, and export bunkering infrastructure.',
    category: 'Energy & Clean Tech',
    recordCount: 72,
    badge: 'Energy & Infrastructure',
    iconName: 'Zap',
    csvContent: `Stakeholder_ID,Stakeholder_Type,Organization,Policy_Section,Category,Region,Comment,Timestamp
SH-001,Renewable Energy Developer,Adani Green Energy,Section 3.1,Incentives,Gujarat,"The 25-year interstate transmission charge waiver is a commendable and transformative step that will significantly reduce green hydrogen production costs.",2025-02-10
SH-002,MSME Manufacturer,Aura Electrotech MSME,Section 5.2,Cost & Compliance,Maharashtra,"Capital subsidy under the SIGHT scheme must be extended to smaller component manufacturers; current thresholds heavily favor large conglomerates.",2025-02-11
SH-003,Environmental Thinktank,Centre for Science & Environment,Section 8.4,Sustainability,New Delhi,"The draft lacks strict water consumption guidelines; producing green hydrogen in arid regions could severely deplete local groundwater aquifers.",2025-02-11
SH-004,Industry Association,FICCI Energy Taskforce,Section 4.1,Licensing,National,"Single-window environmental clearance mechanism outlined in Section 4 is praiseworthy and will eliminate bureaucratic bottlenecks.",2025-02-12
SH-005,Heavy Industry Consumer,Tata Steel Operations,Section 6.3,Feasibility,Jharkhand,"Mandating a 10% green hydrogen blend in steel plants within 18 months is unrealistic and unworkable given current electrolyzer supply shortages.",2025-02-12
SH-006,Legal Expert,Shardul Legal Associates,Clause 3.2,Definitions,New Delhi,"Clause 3.2 is vague regarding the certification mechanism for exported green ammonia. Clear international standards must be adopted.",2025-02-13
SH-007,Fertilizer Corporation,IFFCO Research,Section 7.1,Subsidies,Uttar Pradesh,"We strongly welcome the proposed consumption subsidies for green ammonia in the urea manufacturing sector.",2025-02-13
SH-008,Public Citizen,Coastal Ecology Alliance,Section 11.2,Transparency,Odisha,"Public consultation timelines were too short; citizens living near proposed coastal green hydrogen hubs should be given adequate grievance redressal.",2025-02-14
SH-009,Port Authority,Jawaharlal Nehru Port Trust,Section 9.1,Infrastructure,Maharashtra,"Allocating dedicated bunkering berths for green methanol and ammonia at major ports will create an excellent export ecosystem.",2025-02-14
SH-010,Financial Institution,SBI Capital Markets,Section 12.3,Risk & Investment,Mumbai,"Clarity is desperately needed on long-term power banking terms; arbitrary state regulatory changes represent a severe investment risk.",2025-02-15
SH-011,Renewable Energy Developer,ReNew Power,Section 3.4,Grid Access,Rajasthan,"Banking of renewable energy on an annual basis instead of monthly is crucial for the financial viability of hydrogen plants.",2025-02-15
SH-012,MSME Manufacturer,Apex Valves Pune,Section 5.4,Compliance,Maharashtra,"Filing monthly carbon intensity audits creates unnecessary bureaucratic friction for small pilot projects.",2025-02-16
SH-013,Academic Researcher,IIT Madras Hydrogen Cell,Section 10.1,R&D,Tamil Nadu,"The proposed national R&D corpus of 400 crores is an encouraging initiative to foster indigenous membrane and catalyst technology.",2025-02-16
SH-014,State Power Utility,BESCOM Karnataka,Section 3.5,Grid Stability,Karnataka,"Unrestricted open access without standby charges will impose an unfair financial burden on state electricity distribution companies.",2025-02-17
SH-015,Chemical Manufacturer,Gujarat Fluorochemicals,Section 8.2,Safety,Gujarat,"Mandatory safety buffer zones around high-pressure liquid hydrogen storage tanks are absolutely essential and well-defined.",2025-02-17
SH-016,Clean Tech Startup,H2Pulse Tech,Section 4.3,Innovation,Bengaluru,"The fast-track sandbox for emerging solid oxide electrolyzer technology is a progressive and visionary move.",2025-02-18
SH-017,Industrialist,Jindal Infrastructure,Section 9.4,Logistics,Chhattisgarh,"Dedicated pipeline infrastructure for hydrogen transport is completely ignored in the current draft policy.",2025-02-18
SH-018,Environmental NGO,Greenpeace India,Section 8.5,Ecology,Karnataka,"Green certification must mandate 100% additionality in renewable generation so coal power is not indirectly consumed.",2025-02-19
SH-019,EPC Contractor,Larsen & Toubro Green Power,Section 5.1,Timelines,Chennai,"The 12-month commissioning timeline for electrolyzer manufacturing grants is overly tight and impractical.",2025-02-19
SH-020,Automotive OEM,Ashok Leyland Mobility,Section 7.4,Mobility,Tamil Nadu,"Incentives for hydrogen fuel cell heavy commercial vehicles are commendable and will accelerate freight decarbonization.",2025-02-20
SH-021,Legal Consultant,Trilegal Regulatory Desk,Section 12.1,Penalties,New Delhi,"Section 12 penalties for minor reporting delays are disproportionately harsh and punitive for early-stage operators.",2025-02-20
SH-022,Energy Trader,Indian Energy Exchange,Section 6.1,Market Mechanism,New Delhi,"Creating a domestic green hydrogen trading desk on existing energy exchanges is a brilliant and pragmatic proposal.",2025-02-21
SH-023,Citizen Advocate,Kutch Rural Welfare Forum,Section 11.4,Welfare,Gujarat,"Local communities surrounding green hydrogen special zones must receive mandatory CSR benefits and clean water access.",2025-02-21
SH-024,State Nodal Agency,GEDA Gujarat,Section 2.2,Coordination,Gujarat,"The inter-ministerial task force is an efficient structure to harmonize state and central policies.",2025-02-22
SH-025,MSME Supplier,Precision Anodes Belgaum,Section 5.3,Taxation,Karnataka,"Customs duty exemptions on imported titanium mesh for PEM electrolyzers are urgently needed to maintain competitiveness.",2025-02-22
SH-026,Clean Energy Thinktank,CEEW Energy Transitions,Section 8.1,Standards,New Delhi,"Carbon accounting methodology should follow strict lifecycle emission metrics of less than 2 kg CO2 per kg H2.",2025-02-23
SH-027,Pipeline Operator,GAIL India Ltd,Section 9.2,Infrastructure,New Delhi,"Standard operating procedures for blending up to 10% hydrogen in existing natural gas grids are vague and require technical annexures.",2025-02-23
SH-028,Industry Conglomerate,Reliance Green Energy,Section 1.3,Investment,Mumbai,"The long-term fiscal stability clause gives deep confidence to global institutional investors.",2025-02-24
SH-029,University Department,IIT Bombay Energy Sciences,Section 10.3,Workforce,Maharashtra,"We strongly support the establishment of National Skill Development Centers for hydrogen safety engineers.",2025-02-24
SH-030,Solar Power Producer,Avaada Power,Section 3.3,Tariffs,Rajasthan,"Cross-subsidy surcharges must be permanently waived for dedicated hydrogen solar parks across all state jurisdictions.",2025-02-25`
  },
  {
    id: 'dpdp_rules',
    title: 'Digital Personal Data Protection (DPDP) Implementation Rules 2025',
    description:
      'Public feedback on 6-hour breach disclosure mandates, Significant Data Fiduciary criteria, verifiable parental consent, and cross-border transfer blacklists.',
    category: 'Digital Governance & Law',
    recordCount: 55,
    badge: 'Privacy & Law',
    iconName: 'ShieldCheck',
    csvContent: `Submission_ID,Stakeholder_Group,Organization,Rule_Reference,Category,Region,Feedback_Text,Timestamp
DP-001,Tech Startup,Postman Cloud,Rule 6.2,Compliance,Bengaluru,"The blanket 6-hour mandatory data breach reporting requirement is draconian and impractical for small teams investigating complex zero-day exploits.",2025-02-01
DP-002,Privacy Advocate,Internet Freedom Foundation,Rule 3.1,Citizen Rights,New Delhi,"The streamlined consent architecture empowering individuals with an easy-to-use digital revoke button is an outstanding reform.",2025-02-01
DP-003,E-commerce Enterprise,Flipkart Internet,Rule 8.3,Operations,Karnataka,"Vague definitions of 'Significant Data Fiduciary' leave large online marketplaces in regulatory limbo regarding localized audit mandates.",2025-02-02
DP-004,Healthcare Provider,Apollo Hospitals Group,Rule 9.1,Data Retention,Tamil Nadu,"Requiring immediate deletion of health records upon consent withdrawal conflicts directly with statutory 10-year clinical record maintenance laws.",2025-02-02
DP-005,Fintech Startup,Razorpay Software,Rule 12.1,Exemptions,Bengaluru,"The graduated compliance timeline and sandbox exemptions for seed-stage startups are praiseworthy and protect Indian innovation.",2025-02-03
DP-006,Legal Scholar,NALSAR University,Rule 18.2,Enforcement,Hyderabad,"Section 28 penalties of up to 250 crores lack clear proportionality guidelines for unintentional procedural lapses versus malicious neglect.",2025-02-03
DP-007,Cybersecurity Expert,QuickHeal Security,Rule 6.4,Security,Pune,"Establishing an automated digital portal for breach disclosures to the Data Protection Board is a welcome and efficient step.",2025-02-04
DP-008,Consumer Rights Union,Consumer Guidance Society,Rule 4.2,Transparency,Mumbai,"Children's data protection rules rightly prohibit targeted behavioral tracking and micro-targeted advertising to minors.",2025-02-04
DP-009,Telecom Operator,Bharti Airtel Ltd,Rule 11.1,Cross-Border,Gurugram,"The negative list approach for international data transfers provides much-needed regulatory certainty and ease of doing business.",2025-02-05
DP-010,MSME Federation,FISME Federation,Rule 7.2,Cost & Burden,New Delhi,"Appointing a dedicated Data Protection Officer and conducting mandatory annual independent data audits will bankrupt small digital businesses.",2025-02-05
DP-011,AI Research Lab,Sarvam AI,Rule 14.1,Data Usage,Bengaluru,"Research exemptions under Rule 14 are progressive and will facilitate training foundational Indian AI models without legal paralysis.",2025-02-06
DP-012,Citizen,Public Citizen Forum,Rule 3.3,Privacy,Varanasi,"Multi-lingual consent notices in all 22 scheduled Indian languages will empower non-English speaking citizens across rural India.",2025-02-06
DP-013,Banking Association,Indian Banks Association,Rule 4.4,Verification,Mumbai,"Verifiable parental consent mechanism needs biometrics or Aadhaar OTP verification to prevent spoofing by teenagers.",2025-02-07
DP-014,Software Exporter,NASSCOM Global Desk,Rule 11.3,Global Standards,Noida,"Harmonization with EU GDPR and APAC privacy principles will boost India's IT services export competitiveness.",2025-02-07
DP-015,Legal Aid Society,Delhi Legal Services,Rule 16.1,Redressal,New Delhi,"Grievance redressal turnaround time of 72 hours for citizen data modification requests is clear, fair, and prompt.",2025-02-08`
  },
  {
    id: 'higher_education',
    title: 'National Higher Education Regulatory Framework (NHERF) 2025',
    description:
      'Stakeholder consultation on single-window university accreditation, multi-disciplinary curriculum credits, tenure track rules, and foreign branch campuses.',
    category: 'Education & Research',
    recordCount: 40,
    badge: 'Education & Reform',
    iconName: 'GraduationCap',
    csvContent: `Submission_ID,Stakeholder_Group,Organization,Rule_Reference,Category,Region,Feedback_Text,Timestamp
HE-001,University Vice Chancellor,Delhi University,Clause 2.1,Governance,New Delhi,"Consolidating UGC, AICTE, and NCTE approvals into a single light-touch regulatory portal is a visionary structural reform.",2025-01-15
HE-002,Faculty Association,AIFUCTO Federation,Clause 7.3,Workload,Kolkata,"Mandating 40 hours of weekly classroom contact while simultaneously demanding high-impact SCOPUS publications is an unfeasible burden.",2025-01-16
HE-003,Student Union Leader,All India Students Forum,Clause 11.2,Affordability,Patna,"Allowing foreign university branch campuses to freely set tuition fees will deepen economic inequality and exclude underprivileged students.",2025-01-17
HE-004,Research Scientist,IISc Bengaluru,Clause 5.1,Grants,Bengaluru,"The National Research Foundation competitive grant allocation mechanism is transparent, merit-based, and highly commendable.",2025-01-18
HE-005,Autonomous College Principal,St Xaviers College,Clause 3.4,Curriculum,Mumbai,"The Academic Bank of Credits (ABC) gives students unprecedented flexibility to pursue dual degrees across liberal arts and engineering.",2025-01-19
HE-006,Private University Chancellor,Amity University,Clause 4.2,Autonomy,Noida,"Graded institutional autonomy based on NAAC accreditation scores provides excellent incentives for quality improvement.",2025-01-20
HE-007,Adjunct Professor,Ashoka University,Clause 8.1,Hiring,Sonipat,"Tenure-track rules are vague regarding contract renewals for international visiting scholars and industry experts.",2025-01-21
HE-008,Student Representative,IIT Roorkee Student Senate,Clause 9.3,Internships,Uttarakhand,"Mandatory 6-month industry internships integrated into undergraduate curriculum will dramatically boost graduate employability.",2025-01-22
HE-009,State University Dean,Osmania University,Clause 6.2,Infrastructure,Hyderabad,"Rural universities lack the digital bandwidth and lab infrastructure to implement the proposed virtual laboratory modules.",2025-01-23
HE-010,Academic Council Member,BHU Varanasi,Clause 3.6,Interdisciplinary,Varanasi,"Integrating Indian Knowledge Systems (IKS) seamlessly into modern science curricula is an inspiring cultural step.",2025-01-24`
  },
  {
    id: 'ai_governance',
    title: 'National AI Governance & Safety Sandbox Guidelines 2025',
    description:
      'Consultation on algorithmic accountability, synthetic media watermarking, high-risk foundation model testing, and open-source exemptions.',
    category: 'Emerging Tech & AI',
    recordCount: 45,
    badge: 'AI & Safety',
    iconName: 'Cpu',
    csvContent: `Sub_ID,Entity_Type,Organization,Specific_Clause,Domain,Region,Public_Comment,Timestamp
AI-001,AI Startup,Krutrim Tech,Section 2.1,Compliance,Bengaluru,"The regulatory sandbox offering safe compute credits and fast-track liability protection is a game-changer for Indian generative AI startups.",2025-02-10
AI-002,Open Source Advocate,Open Source India Foundation,Section 4.3,Open Source,Pune,"Subjecting open-weight model releases to the same safety testing mandates as closed proprietary LLMs will cripple grassroots developers.",2025-02-11
AI-003,Civil Rights NGO,Amnesty India Tech,Section 7.2,Safety & Rights,New Delhi,"Mandatory algorithmic bias testing before deploying public sector automated decision systems is essential and should be strictly audited.",2025-02-12
AI-004,Media & Broadcast Union,News Broadcasters Federation,Section 5.1,Watermarking,Mumbai,"Cryptographic watermarking for AI-generated synthetic media and deepfakes is timely and will protect public trust during national elections.",2025-02-13
AI-005,Medical AI Developer,Qure.ai Diagnostics,Section 3.4,Healthcare,Mumbai,"Pre-market clinical trials for diagnostic AI algorithms are clearly laid out and align well with Central Drugs Standard Control norms.",2025-02-14
AI-006,Legal Scholar,National Law School Bangalore,Section 8.1,Liability,Bengaluru,"Strict strict-liability clauses for autonomous AI systems need clearer carve-outs for unpredictable third-party prompt injection attacks.",2025-02-15
AI-007,Hardware Manufacturer,C-DAC Supercomputing,Section 6.2,Infrastructure,Pune,"Prioritizing sovereign GPU compute cluster access for academic researchers is a praiseworthy and strategic initiative.",2025-02-16`
  }
];
