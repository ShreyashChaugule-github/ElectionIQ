export const STATS = [
  { label: 'Total Parties', value: '8', sub: 'Recognised parties' },
  { label: 'Vote Bots', value: '6', sub: 'AI monitoring bots' },
  { label: 'Voter Turnout', value: '67%', sub: '2024 general election' },
  { label: 'Total Seats', value: '543', sub: 'Lok Sabha seats' },
];

export const PARTIES = [
  { name: 'BJP', alliance: 'NDA', seats: 240, color: '#ff6b2b' },
  { name: 'INC', alliance: 'INDIA', seats: 99, color: '#138808' },
  { name: 'SP', alliance: 'INDIA', seats: 37, color: '#e74c3c' },
  { name: 'AITC', alliance: 'INDIA', seats: 29, color: '#1abc9c' },
  { name: 'DMK', alliance: 'INDIA', seats: 22, color: '#e74c3c' },
  { name: 'TDP', alliance: 'NDA', seats: 16, color: '#f39c12' },
  { name: 'JD(U)', alliance: 'NDA', seats: 12, color: '#3498db' },
  { name: 'Others', alliance: 'Various', seats: 88, color: '#95a5a6' },
];

export const BOTS = [
  { name: 'TurnoutBot', desc: 'Monitors voter turnout % by constituency in real time', status: 'active' },
  { name: 'FakeNewsBot', desc: 'Detects and flags election misinformation on social media', status: 'active' },
  { name: 'BoothBot', desc: 'Tracks polling booth queue lengths and wait times', status: 'active' },
  { name: 'ComplianceBot', desc: 'Monitors MCC violations by political parties', status: 'idle' },
  { name: 'ResultBot', desc: 'Aggregates counting results from all 543 constituencies', status: 'idle' },
  { name: 'AccessBot', desc: 'Checks voter accessibility issues at booths', status: 'active' },
];

export const TIMELINE = [
  {
    title: 'Election announced',
    badge: 'Completed',
    status: 'done',
    date: 'Day 0 · Model Code of Conduct begins',
    description:
      'Official notification by Election Commission. MCC comes into force. Political parties finalise candidate lists. No new government schemes can be announced.',
  },
  {
    title: 'Voter registration',
    badge: 'Completed',
    status: 'done',
    date: 'Day 15–30',
    description:
      'Eligible citizens (18+) register on electoral rolls via Form 6. Update address via Form 8. Verify registration on voters.eci.gov.in or call 1950.',
  },
  {
    title: 'Nominations & campaign',
    badge: 'Active',
    status: 'cur',
    date: 'Day 28–42',
    description:
      'Candidates file Form 2B (Lok Sabha) or Form 2 (State). Security deposit required. Scrutiny period, then withdrawal window. Active campaign phase begins.',
  },
  {
    title: 'Silence period',
    badge: 'Upcoming',
    status: 'pend',
    date: '48 hrs before polling',
    description:
      'All public campaigning halts. No media ads, no rallies. Digital media blackout enforced by ECI.',
  },
  {
    title: 'Polling day',
    badge: 'Upcoming',
    status: 'pend',
    date: '7:00 AM – 6:00 PM',
    description:
      'Voters present ID at booth. EVM button pressed. VVPAT slip visible 7 seconds. Indelible ink marks left index finger.',
  },
  {
    title: 'Counting & result',
    badge: 'Upcoming',
    status: 'pend',
    date: 'Counting from 8:00 AM',
    description:
      'Postal ballots counted first. EVM counting round by round. Returning Officer signs Form 20 to declare winner. First Past The Post system.',
  },
];

export const FORMS = [
  { title: 'Form 6', sub: 'New voter registration (Lok Sabha)', icon: '📋' },
  { title: 'Form 6A', sub: 'Overseas Indian voter registration', icon: '🌏' },
  { title: 'Form 7', sub: 'Objection to voter registration', icon: '❌' },
  { title: 'Form 8', sub: 'Change of address / correction of details', icon: '✏️' },
  { title: 'Form 2B', sub: 'Lok Sabha nomination form', icon: '🏛️' },
  { title: 'Form 2', sub: 'State Assembly nomination form', icon: '🗳️' },
  { title: 'Form 4', sub: 'Rajya Sabha nomination form', icon: '📜' },
  { title: 'Form 20', sub: 'Declaration of election result', icon: '🏆' },
];

export const FIRST_VOTE_ROADMAP = [
  {
    step: 1,
    title: 'Check Eligibility',
    status: 'pending',
    details: [
      'Must be 18 years or older',
      'Must be an Indian citizen',
      'Must be a resident of the constituency for at least 6 months',
      'Not disqualified by law (sound mind, not detained, no conviction)',
    ],
  },
  {
    step: 2,
    title: 'Obtain Form 6',
    status: 'pending',
    details: [
      'Download from ECI website (eci.gov.in) or collect from your local election office',
      'Can also fill online on the voter.eci.gov.in portal',
      'Form 6 is the "Application for Inclusion of Name in Electoral Roll"',
    ],
  },
  {
    step: 3,
    title: 'Fill Form 6 Details',
    status: 'pending',
    details: [
      'Personal information: Name, father\'s name, date of birth',
      'Address details: Complete residential address in your constituency',
      'Occupation and other relevant details',
      'Provide clear, legible handwriting or typed entries',
    ],
  },
  {
    step: 4,
    title: 'Gather Required Documents',
    status: 'pending',
    details: [
      'Proof of citizenship: Passport, Aadhaar card, or birth certificate',
      'Proof of residence: Utility bill, rental agreement, or bank statement',
      'Proof of age: Birth certificate, school leaving certificate, or Aadhaar',
      'ID-sized photograph (2-3 recent passport photos)',
    ],
  },
  {
    step: 5,
    title: 'Submit Your Application',
    status: 'pending',
    details: [
      'Online: Use voter.eci.gov.in and upload supporting documents',
      'Offline: Visit your local election office or designated collection center',
      'In-person: Submit to your booth-level officer or polling station',
      'Keep a copy for your records',
    ],
  },
  {
    step: 6,
    title: 'Verification Process',
    status: 'pending',
    details: [
      'Election Commission will verify your details (usually 7-15 days)',
      'They will check if you are eligible and not already registered',
      'Booth-level officer may conduct verification or contact you',
      'Mock rolls are published for public objection period',
    ],
  },
  {
    step: 7,
    title: 'Voter ID Issuance',
    status: 'pending',
    details: [
      'After approval, EPIC (Electors Photo ID Card) is issued',
      'Collect your voter ID from the election office',
      'EPIC contains your name, photograph, and voter reference number',
      'Valid nationwide for all future elections',
    ],
  },
  {
    step: 8,
    title: 'Ready to Vote!',
    status: 'pending',
    details: [
      'You are now registered as a voter',
      'Receive SMS/notification about your polling station',
      'On polling day, bring your voter ID and visit your designated booth',
      'Vote between 7 AM and 6 PM on polling day',
    ],
  },
];

export const FORM_ROADMAPS = {
  'Form 6': [
    { step: 1, title: 'Check Eligibility', details: ['18+ age', 'Indian citizen', 'Constituency resident'] },
    { step: 2, title: 'Fill Form 6', details: ['Personal info', 'Address info', 'Photo upload'] },
    { step: 3, title: 'Submit', details: ['Online at voters.eci.gov.in', 'Offline at BLO office'] },
    { step: 4, title: 'Verification', details: ['BLO field visit', 'Roll entry'] },
  ],
  'Form 6A': [
    { step: 1, title: 'Eligibility', details: ['NRI with Indian passport', 'Not registered elsewhere'] },
    { step: 2, title: 'Documentation', details: ['Passport copy', 'Visa copy', 'Address proof'] },
    { step: 3, title: 'Submission', details: ['Post or In-person to ERO'] },
  ],
  'Form 7': [
    { step: 1, title: 'Reason', details: ['Death of voter', 'Shifted address', 'Wrong entry'] },
    { step: 2, title: 'Evidence', details: ['Death certificate (if applicable)', 'Proof of shifting'] },
    { step: 3, title: 'Objection', details: ['File Form 7 with ERO', 'Hearing process'] },
  ],
  'Form 8': [
    { step: 1, title: 'Type', details: ['Correction of name/photo', 'Change of address', 'Marking as PwD'] },
    { step: 2, title: 'Submission', details: ['Upload proof of change', 'Online portal or App'] },
  ],
  'Form 2B': [
    { step: 1, title: 'Nomination', details: ['File by candidate', 'Deposit fee', 'Affidavit Form 26'] },
    { step: 2, title: 'Scrutiny', details: ['Returning Officer checks docs', 'Valid nominations published'] },
  ],
  'Form 2': [
    { step: 1, title: 'State Nomination', details: ['Candidate filing', 'Security deposit', 'Oath of allegiance'] },
  ],
  'Form 4': [
    { step: 1, title: 'Rajya Sabha', details: ['Legislative Assembly nomination', 'STV voting process'] },
  ],
  'Form 20': [
    { step: 1, title: 'Counting', details: ['EVM counting', 'VVPAT verification', 'Final result declaration'] },
  ],
};

export const AI_SUGGESTIONS = [
  'How do I register to vote in India?',
  'What ID is needed to vote?',
  'How does EVM vote counting work?',
  'What is NOTA and how to use it?',
  'How is the Lok Sabha election winner declared?',
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'bn', label: 'বাংলা' },
];

export const LANGUAGE_LABELS = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
};

export const QUIZ = [
  {
    q: 'The Lok Sabha has how many total seats?',
    opts: ['543', '545', '552', '537'],
    ans: 0,
    exp: 'Lok Sabha has 543 elected seats — 530 from states and 13 from UTs. Two seats were nominated for Anglo-Indians until 2020.',
  },
  {
    q: 'What is the minimum age to vote in Indian general elections?',
    opts: ['16', '18', '21', '25'],
    ans: 1,
    exp: 'The 61st Constitutional Amendment (1988) lowered the voting age from 21 to 18 years, enabling millions more youth to participate.',
  },
  {
    q: 'Which body conducts elections in India?',
    opts: ['Supreme Court', 'Election Commission of India', 'Parliament', 'UPSC'],
    ans: 1,
    exp: 'The Election Commission of India (ECI), established in 1950 under Article 324, is an autonomous constitutional body responsible for administering elections.',
  },
  {
    q: 'EVM stands for?',
    opts: ['Electronic Voter Machine', 'Electronic Voting Machine', 'Electoral Voting Model', 'Electronic Vote Monitor'],
    ans: 1,
    exp: 'EVM stands for Electronic Voting Machine. India began using EVMs in 1982 and transitioned fully to EVMs by 2004.',
  },
  {
    q: 'VVPAT stands for?',
    opts: ['Voter Verified Paper Audit Trail', 'Verified Voter Paper Audit Tracker', 'Voter Verification Paper Audit Trail', 'Vote Verified Printed Audit Track'],
    ans: 0,
    exp: 'VVPAT — Voter Verified Paper Audit Trail — shows a printed slip for 7 seconds confirming your vote before it drops into a sealed box.',
  },
  {
    q: 'How long is the term of the Lok Sabha?',
    opts: ['4 years', '5 years', '6 years', '3 years'],
    ans: 1,
    exp: 'The Lok Sabha term is 5 years from its first sitting after general elections, unless dissolved earlier by the President on advice of the PM.',
  },
  {
    q: 'What does "NOTA" stand for on the EVM?',
    opts: ['Not One of Them Acceptable', 'None of the Above', 'No Other Than Abstain', 'Not a Total Acceptance'],
    ans: 1,
    exp: 'NOTA (None of the Above) was introduced in India from November 2013 following a Supreme Court order, allowing voters to reject all candidates.',
  },
  {
    q: 'Rajya Sabha members serve a term of?',
    opts: ['4 years', '5 years', '6 years', 'Lifetime'],
    ans: 2,
    exp: 'Rajya Sabha members serve 6-year staggered terms. One-third of members retire every 2 years. The Rajya Sabha is a permanent body and is never dissolved.',
  },
  {
    q: 'Model Code of Conduct comes into force from?',
    opts: ['Day of polling', 'Date of result announcement', 'Date of election announcement', 'Date of nomination filing'],
    ans: 2,
    exp: 'The Model Code of Conduct (MCC) comes into force immediately from the date the Election Commission announces the election schedule.',
  },
  {
    q: 'Which Indian state first used EVMs in elections?',
    opts: ['Goa', 'Kerala', 'Maharashtra', 'Rajasthan'],
    ans: 0,
    exp: 'Goa was the first state to use EVMs entirely in its 1999 state assembly elections. The pilot for EVMs started in Parur, Kerala in 1982.',
  },
  {
    q: 'The election symbol of the Congress party (INC) is?',
    opts: ['Lotus', 'Cycle', 'Hand', 'Arrow'],
    ans: 2,
    exp: 'The Indian National Congress (INC) uses the "Hand" as its official election symbol, allocated by the Election Commission.',
  },
  {
    q: 'Article 324 of the Constitution deals with?',
    opts: ['Right to vote', 'Election Commission', 'Delimitation of constituencies', 'Anti-defection law'],
    ans: 1,
    exp: 'Article 324 establishes the Election Commission of India and vests in it the superintendence, direction, and control of elections.',
  },
  {
    q: 'The Tenth Schedule of the Constitution relates to?',
    opts: ['Election disputes', 'Delimitation', 'Anti-defection law', 'Emergency provisions'],
    ans: 2,
    exp: 'The Tenth Schedule, added by the 52nd Amendment in 1985, contains provisions about disqualification of members on grounds of defection (anti-defection law).',
  },
  {
    q: 'How many phases were there in the 2024 Lok Sabha elections?',
    opts: ['5', '6', '7', '9'],
    ans: 2,
    exp: 'The 2024 Lok Sabha elections were conducted in 7 phases from April 19 to June 1, 2024, with counting on June 4, 2024.',
  },
  {
    q: 'Which form is used for new voter registration?',
    opts: ['Form 2', 'Form 6', 'Form 8', 'Form 20'],
    ans: 1,
    exp: 'Form 6 is used by eligible citizens to apply for inclusion of their name in the electoral roll for the first time.',
  },
  {
    q: 'The Chief Election Commissioner of India can be removed by?',
    opts: ['President alone', 'Parliament via impeachment process', 'Prime Minister', 'Supreme Court'],
    ans: 1,
    exp: 'The CEC can only be removed by an order of the President after an address by each House of Parliament, similar to a Supreme Court judge.',
  },
  {
    q: 'What ink is used to mark voters\' fingers on polling day?',
    opts: ['Permanent ink', 'Indelible ink', 'Invisible ink', 'Washable ink'],
    ans: 1,
    exp: 'Indelible ink (silver nitrate-based) is applied to the left index finger to prevent double voting. It cannot be washed off for several weeks.',
  },
  {
    q: 'Voter ID cards in India are officially called?',
    opts: ['EPIC', 'Voter Proof Card', 'Electoral Photo ID', 'Aadhaar Voter Card'],
    ans: 0,
    exp: 'Voter ID cards are officially called EPIC — Electors Photo Identity Card. They were introduced in 1993 under the Chief Election Commissioner T.N. Seshan.',
  },
  {
    q: 'Who appoints the Chief Election Commissioner of India?',
    opts: ['Parliament', 'Prime Minister', 'President', 'Supreme Court'],
    ans: 2,
    exp: 'The President of India appoints the Chief Election Commissioner on the recommendation of a selection committee, as per the CEC and other EC Act 2023.',
  },
  {
    q: 'National Voters Day is celebrated in India on?',
    opts: ['26 January', '15 August', '25 January', '15 September'],
    ans: 2,
    exp: 'National Voters Day is celebrated on January 25 every year, marking the founding day of the Election Commission of India (January 25, 1950).',
  },
];

export const quizQuestions = QUIZ.map((item) => ({
  question: item.q,
  options: item.opts,
  answer: item.opts[item.ans],
}));
