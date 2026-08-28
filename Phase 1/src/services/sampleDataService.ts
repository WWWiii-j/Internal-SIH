import { SampleDatasetInfo } from '../types';

export const SAMPLE_DATASETS: SampleDatasetInfo[] = [
  {
    id: 'green_hydrogen',
    title: 'Draft National Green Hydrogen & Clean Ammonia Policy 2025',
    description:
      'Stakeholder consultation on electrolyzer subsidies, open access transmission waivers, export incentives, and environmental standards.',
    category: 'Energy & Environment',
    commentCount: 72,
    iconName: 'Zap',
    csvContent: `Stakeholder_ID,Stakeholder_Type,Category,Comment
SH-001,Renewable Energy Developer,Incentives,"The 25-year interstate transmission charge waiver is a commendable and transformative step that will significantly reduce green hydrogen production costs."
SH-002,MSME Manufacturer,Cost & Compliance,"Capital subsidy under the SIGHT scheme must be extended to smaller component manufacturers; current thresholds heavily favor large conglomerates."
SH-003,Environmental Thinktank,Sustainability,"The draft lacks strict water consumption guidelines; producing green hydrogen in arid regions could severely deplete local groundwater aquifers."
SH-004,Industry Association,Licensing,"Single-window environmental clearance mechanism outlined in Section 4 is praiseworthy and will eliminate bureaucratic bottlenecks."
SH-005,Heavy Industry Consumer,Feasibility,"Mandating a 10% green hydrogen blend in steel plants within 18 months is unrealistic and unworkable given current electrolyzer supply shortages."
SH-006,Legal Expert,Definitions,"Clause 3.2 is vague regarding the certification mechanism for exported green ammonia. Clear international standards must be adopted."
SH-007,Fertilizer Corporation,Subsidies,"We strongly welcome the proposed consumption subsidies for green ammonia in the urea manufacturing sector."
SH-008,Public Citizen,Transparency,"Public consultation timelines were too short; citizens living near proposed coastal green hydrogen hubs should be given adequate grievance redressal."
SH-009,Port Authority,Infrastructure,"Allocating dedicated bunkering berths for green methanol and ammonia at major ports will create an excellent export ecosystem."
SH-010,Financial Institution,Risk & Investment,"Clarity is desperately needed on long-term power banking terms; arbitrary state regulatory changes represent a severe investment risk."
SH-011,Renewable Energy Developer,Grid Access,"Banking of renewable energy on an annual basis instead of monthly is crucial for the financial viability of hydrogen plants."
SH-012,MSME Manufacturer,Compliance,"Filing monthly carbon intensity audits creates unnecessary bureaucratic friction for small pilot projects."
SH-013,Academic Researcher,R&D,"The proposed national R&D corpus of 400 crores is an encouraging initiative to foster indigenous membrane and catalyst technology."
SH-014,State Power Utility,Grid Stability,"Unrestricted open access without standby charges will impose an unfair financial burden on state electricity distribution companies."
SH-015,Chemical Manufacturer,Safety,"Mandatory safety buffer zones around high-pressure liquid hydrogen storage tanks are absolutely essential and well-defined."
SH-016,Clean Tech Startup,Innovation,"The fast-track sandbox for emerging solid oxide electrolyzer technology is a progressive and visionary move."
SH-017,Industrialist,Logistics,"Dedicated pipeline infrastructure for hydrogen transport is completely ignored in the current draft policy."
SH-018,Environmental NGO,Ecology,"Green certification must mandate 100% additionality in renewable generation so coal power is not indirectly consumed."
SH-019,EPC Contractor,Timelines,"The 12-month commissioning timeline for electrolyzer manufacturing grants is overly tight and impractical."
SH-020,Automotive OEM,Mobility,"Incentives for hydrogen fuel cell heavy commercial vehicles are commendable and will accelerate freight decarbonization."
SH-021,Legal Consultant,Penalties,"Section 12 penalties for minor reporting delays are disproportionately harsh and punitive for early-stage operators."
SH-022,Energy Trader,Market Mechanism,"Creating a domestic green hydrogen trading desk on existing energy exchanges is a brilliant and pragmatic proposal."
SH-023,Citizen Advocate,Welfare,"Local communities surrounding green hydrogen special zones must receive mandatory CSR benefits and clean water access."
SH-024,State Nodal Agency,Coordination,"The inter-ministerial task force is an efficient structure to harmonize state and central policies."
SH-025,MSME Supplier,Taxation,"Customs duty exemptions on imported titanium mesh for PEM electrolyzers are urgently needed to maintain competitiveness."
SH-026,Clean Energy Thinktank,Standards,"Carbon accounting methodology should follow strict lifecycle emission metrics of less than 2 kg CO2 per kg H2."
SH-027,Pipeline Operator,Infrastructure,"Standard operating procedures for blending up to 10% hydrogen in existing natural gas grids are vague and require technical annexures."
SH-028,Industry Conglomerate,Investment,"The long-term fiscal stability clause gives deep confidence to global institutional investors."
SH-029,University Department,Workforce,"We strongly support the establishment of National Skill Development Centers for hydrogen safety engineers."
SH-030,Solar Power Producer,Tariffs,"Cross-subsidy surcharges must be permanently waived for dedicated hydrogen solar parks across all state jurisdictions."
SH-031,Logistics Firm,Transport,"Liquid organic hydrogen carriers (LOHC) should be included under eligible transport subsidies alongside cryogenic trucks."
SH-032,Public Citizen,Safety,"Clear disaster management protocols must be made publicly available for villages located near hydrogen storage hubs."
SH-033,State Regulator,Tariffs,"The draft encroaches upon state regulatory commission powers regarding open access tariff determination."
SH-034,MSME Federation,Finance,"Collateral-free soft loans through IREDA are essential for tier-2 component suppliers."
SH-035,Industrial User,Reliability,"Unscheduled power cuts from state grids will damage electrolyzer stacks; guaranteed 24x7 green power delivery is non-negotiable."
SH-036,Global Energy Firm,Collaboration,"Bilateral certification agreements with European and Asian import markets will unlock immense export potential."
SH-037,Environmental Scientist,Resource,"Desalination plants should be mandated for coastal projects to prevent pressure on municipal drinking water supplies."
SH-038,Trade Union,Employment,"Fair wages and comprehensive safety insurance for plant workers handling high-pressure hydrogen must be codified."
SH-039,Startup Founder,Incubation,"Incubation grants for deep-tech hydrogen storage materials are praiseworthy and timely."
SH-040,Steel Manufacturer,Transition,"A longer 3-year transition runway is required before enforcing mandatory hydrogen blending quotas."
SH-041,Financial Analyst,Subsidies,"Direct benefit transfer mechanism for production-linked incentives is transparent and reduces graft."
SH-042,Legal Scholar,Arbitration,"Dispute resolution timelines under Section 18 are too ambiguous; fast-track commercial arbitration should be specified."
SH-043,Green Tech Investor,Returns,"The return on equity expectations in the tariff model are too low given the technological risks involved."
SH-044,Clean Energy Association,Growth,"This policy draft represents a giant leap forward in establishing India as a global green hydrogen champion."
SH-045,Rural Panchayat,Land Access,"Farmland acquisition for ultra-mega hydrogen parks must provide equitable compensation and rehabilitation."
SH-046,Testing Agency,Standards,"Accreditation of domestic testing labs for Type-IV composite hydrogen cylinders is commendable."
SH-047,Consumer Group,Pricing,"Fertilizer subsidies must ensure that farmers are protected from any initial price spikes in green ammonia urea."
SH-048,Equipment Manufacturer,Localization,"Phased manufacturing program (PMP) targets for local content are balanced and achievable."
SH-049,Industry Executive,Approvals,"The single portal for forest, environmental, and aviation clearances is an extraordinary administrative reform."
SH-050,Research Scientist,Catalyst,"Indigenization of non-precious group metal catalysts should receive dedicated mission-mode grants."
SH-051,Public Stakeholder,Environment,"Pollution control boards must publish real-time environmental monitoring logs of all hydrogen generation facilities."
SH-052,Logistics Operator,Fleet,"Exempting hydrogen fuel trucks from interstate toll charges will encourage rapid fleet conversion."
SH-053,Power Grid Operator,Integration,"Large-scale intermittent solar feeding into hydrogen plants could cause frequency deviations without adequate battery buffers."
SH-054,Green Fuel Exporter,Logistics,"Port handling charges for cryogenic green ammonia are currently excessive and need rationalization."
SH-055,MSME Engineering Unit,Opportunities,"Cluster-based common testing centers for valves and compressors will empower MSMEs greatly."
SH-056,Financial Consultant,Financing,"Green bonds issued under this framework should be granted tax-exempt status to attract retail investors."
SH-057,Industry Observer,Vision,"Overall a visionary, robust, and pragmatic roadmap that sets the right benchmark for industrial decarbonization."
SH-058,Chemical Safety Board,Regulations,"Emergency shutdown valve specifications need to be updated to match latest ISO/TR 15916 standards."
SH-059,Renewable Developer,Taxation,"GST on electrolyzer components should be reduced from 18% to 5% to match renewable equipment."
SH-060,Citizen Reviewer,Clarity,"The simplified English summary of the draft legislation made it very easy for ordinary citizens to participate."
SH-061,Legal Expert,Jurisdiction,"Multiple overlapping definitions of 'clean ammonia' between MOEFCC and MNRE create confusion and need harmonization."
SH-062,Battery Storage Developer,Synergy,"Hybridizing hydrogen electrolyzers with battery energy storage systems should receive extra viability gap funding."
SH-063,Textile Manufacturer,Boiler,"Incentives for replacing coal boilers with hydrogen-fired boilers in industrial clusters are missing and should be introduced."
SH-064,State Pollution Officer,Compliance,"Auditing compliance through automated digital telemetry is a fantastic modern governance measure."
SH-065,Small Business Owner,Hurdles,"The minimum project capacity limit of 10 MW excludes small entrepreneurs who want to establish decentralized hydrogen stations."
SH-066,International Trade Expert,WTO,"The domestic content requirements must be structured carefully to ensure full WTO compliance."
SH-067,Policy Analyst,Governance,"The annual progress review by the Cabinet Secretariat ensures high accountability and timely execution."
SH-068,Industry Engineer,Standards,"Guidelines on hydrogen embrittlement in carbon steel pipelines are incomplete and require technical revision."
SH-069,Environmental Activist,Ecosystem,"Strict biodiversity impact assessments must be conducted before establishing hydrogen hubs in fragile coastal zones."
SH-070,Chamber of Commerce,Economic Impact,"This progressive policy will generate over 600,000 clean energy jobs and attract massive foreign direct investment."
SH-071,Municipal Corporation,Waste-to-Hydrogen,"Incentivizing waste-to-hydrogen municipal solid waste gasification projects will solve both urban waste and energy challenges."
SH-072,Independent Auditor,Oversight,"Third-party verification of green energy input guarantees high transparency and builds global buyer trust."`
  },
  {
    id: 'dpdp_rules',
    title: 'Digital Personal Data Protection (DPDP) Implementation Rules 2025',
    description:
      'Stakeholder comments on consent manager frameworks, data breach notifications within 6 hours, cross-border data transfer, and startup exemptions.',
    category: 'Digital Governance & Law',
    commentCount: 55,
    iconName: 'ShieldCheck',
    csvContent: `Stakeholder_ID,Stakeholder_Type,Category,Comment
DP-001,Tech Startup Founder,Compliance,"The blanket 6-hour mandatory data breach reporting requirement is draconian and impractical for small teams investigating complex zero-day exploits."
DP-002,Privacy Advocate,Citizen Rights,"The streamlined consent architecture empowering individuals with an easy-to-use digital revoke button is an outstanding reform."
DP-003,E-commerce Enterprise,Operations,"Vague definitions of 'Significant Data Fiduciary' leave large online marketplaces in regulatory limbo regarding localized audit mandates."
DP-004,Healthcare Provider,Data Retention,"Requiring immediate deletion of health records upon consent withdrawal conflicts directly with statutory 10-year clinical record maintenance laws."
DP-005,Fintech Startup,Exemptions,"The graduated compliance timeline and sandbox exemptions for seed-stage startups are praiseworthy and protect Indian innovation."
DP-006,Legal Scholar,Enforcement,"Section 28 penalties of up to 250 crores lack clear proportionality guidelines for unintentional procedural lapses versus malicious neglect."
DP-007,Cybersecurity Expert,Security,"Establishing an automated digital portal for breach disclosures to the Data Protection Board is a welcome and efficient step."
DP-008,Consumer Rights Union,Transparency,"Children's data protection rules rightly prohibit targeted behavioral tracking and micro-targeted advertising to minors."
DP-009,Telecom Operator,Cross-Border,"The negative list approach for international data transfers provides much-needed regulatory certainty and ease of doing business."
DP-010,MSME Federation,Cost & Burden,"Appointing a dedicated Data Protection Officer and conducting mandatory annual independent data audits will bankrupt small digital businesses."
DP-011,AI Research Lab,Data Usage,"Research exemptions under Rule 14 are progressive and will facilitate training foundational Indian AI models without legal paralysis."
DP-012,Citizen,Privacy,"Multi-lingual consent notices in all 22 scheduled Indian languages will empower non-English speaking citizens across rural India."
DP-013,Banking Association,Verification,"Verifiable parental consent mechanism needs biometrics or Aadhaar OTP verification to prevent spoofing by teenagers."
DP-014,Software Exporter,Global Standards,"Harmonization with EU GDPR and APAC privacy principles will boost India's IT services export competitiveness."
DP-015,Legal Aid Society,Redressal,"Grievance redressal turnaround time of 72 hours for citizen data modification requests is clear, fair, and prompt."
DP-016,Digital Marketing Agency,Consent,"Prohibiting bundled consent terms is a commendable measure that puts an end to dark patterns and forced agreements."
DP-017,SaaS Company,Auditing,"Draft rules should permit automated cloud compliance certifications rather than insisting on physical on-premise audits."
DP-018,Hospital Chain,Clarity,"Emergency medical processing exemptions during public health outbreaks are sensible and safeguard patient welfare."
DP-019,Civil Liberties NGO,Surveillance,"Government agency exemptions under Rule 17 are overly broad and lack adequate judicial oversight mechanisms."
DP-020,Fintech App Developer,Architecture,"Consent Manager interoperability standards through open APIs will foster a competitive and consumer-friendly ecosystem."
DP-021,Enterprise IT Officer,Security,"Mandating multi-factor authentication and pseudonymization for sensitive datasets is a robust security baseline."
DP-022,Freelance Developer,Clarity,"Guidelines on handling open-source telemetry data in developer libraries are confusing and need explicit clarification."
DP-023,EdTech Platform,Minors,"Age verification protocols must avoid intrusive document collection that creates new privacy risks for school students."
DP-024,Senior Citizen,Accessibility,"Voice-enabled consent workflows for visually impaired and elderly citizens should be made mandatory under accessibility norms."
DP-025,Industry Chamber,Implementation,"A minimum 12-month transition runway is essential before penal provisions are brought into active enforcement."
DP-026,Digital Rights Foundation,Accountability,"The Data Protection Board of India must publish an annual transparency index detailing complaints received and resolved."
DP-027,Payment Aggregator,Speed,"Tokenized payment data processing should be explicitly covered under deemed legitimate use to prevent checkout delays."
DP-028,Cloud Provider,Infrastructure,"Recognition of ISO 27701 privacy certifications as deemed compliance will save thousands of redundant audit hours."
DP-029,University Researcher,Academic,"Exemption for academic surveys and student research projects is commendable and supports higher learning."
DP-030,Citizen User,Control,"The self-service data portability dashboard allowing citizens to download all their personal data in JSON format is fantastic."`
  },
  {
    id: 'higher_education',
    title: 'National Higher Education Regulatory Framework (NHERF) 2025',
    description:
      'Public feedback on single-window university accreditation, multi-disciplinary curriculum credits, faculty tenure reforms, and foreign university campuses.',
    category: 'Education & Research',
    commentCount: 40,
    iconName: 'GraduationCap',
    csvContent: `Stakeholder_ID,Stakeholder_Type,Category,Comment
HE-001,University Vice Chancellor,Governance,"Consolidating UGC, AICTE, and NCTE approvals into a single light-touch regulatory portal is a visionary structural reform."
HE-002,Faculty Association,Workload,"Mandating 40 hours of weekly classroom contact while simultaneously demanding high-impact SCOPUS publications is an unfeasible burden."
HE-003,Student Union Leader,Affordability,"Allowing foreign university branch campuses to freely set tuition fees will deepen economic inequality and exclude underprivileged students."
HE-004,Research Scientist,Grants,"The National Research Foundation competitive grant allocation mechanism is transparent, merit-based, and highly commendable."
HE-005,Autonomous College Principal,Curriculum,"The Academic Bank of Credits (ABC) gives students unprecedented flexibility to pursue dual degrees across liberal arts and engineering."
HE-006,Private University Chancellor,Autonomy,"Graded institutional autonomy based on NAAC accreditation scores provides excellent incentives for quality improvement."
HE-007,Adjunct Professor,Hiring,"Tenure-track rules are vague regarding contract renewals for international visiting scholars and industry experts."
HE-008,Student Representative,Internships,"Mandatory 6-month industry internships integrated into undergraduate curriculum will dramatically boost graduate employability."
HE-009,State University Dean,Infrastructure,"Rural universities lack the digital bandwidth and lab infrastructure to implement the proposed virtual laboratory modules."
HE-010,Academic Council Member,Interdisciplinary,"Integrating Indian Knowledge Systems (IKS) seamlessly into modern science curricula is an inspiring cultural step."
HE-011,MSME Employer,Skill Alignment,"Apprenticeship-embedded degree courses will bridge the critical skill gap between classroom theory and factory floor realities."
HE-012,Doctoral Scholar,Fellowships,"Stipends for junior research fellows must be indexed to inflation and disbursed directly on the 1st of every month without delays."
HE-013,Legal Academic,Dispute,"The National Higher Education Tribunal provides a fast and specialized forum for resolving university-faculty disputes."
HE-014,College Librarian,Open Access,"National subscription to global academic journals accessible to all accredited colleges is an invaluable democratic breakthrough."
HE-015,Education NGO,Inclusion,"Reservation policies and special scholarship allocations in private higher education institutions need stricter enforcement guidelines."`
  }
];
