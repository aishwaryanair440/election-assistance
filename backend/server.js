const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend/dist directory
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));
app.use(express.static(path.join(process.cwd(), 'frontend/dist'))); // Alternative for root execution

// ──────────────────────────────────────
// DATA STORE & SEED DATA
// ──────────────────────────────────────
const seedModules = [
  { order: 1, title: 'What is an Election?', content: 'An election is a formal group decision-making process by which a population chooses an individual or political party to hold public office. In India, it is the world\'s largest democratic exercise, overseen by the Election Commission of India (ECI). Elections are the backbone of any democracy, ensuring that the power lies with the people. Through elections, citizens can choose their leaders, hold them accountable, and participate in governance.\n\nThe concept of elections dates back to ancient Greece, but modern democratic elections have evolved significantly. India adopted universal adult suffrage from its very first election in 1951-52, making it one of the most inclusive democracies from inception.', icon: 'vote' },
  { order: 2, title: 'Types of Elections in India', content: 'India conducts several types of elections:\n\n**1. General Elections (Lok Sabha):** Held every 5 years to elect 543 members of the lower house of Parliament. The party or coalition winning the majority forms the central government.\n\n**2. State Assembly Elections (Vidhan Sabha):** Conducted to elect members of state legislatures. Each state has its own assembly, and elections may not coincide with general elections.\n\n**3. Local Body Elections:** Include Panchayat elections (rural) and Municipal Corporation/Council elections (urban). These form the grassroots level of Indian democracy.\n\n**4. Rajya Sabha Elections:** Members are elected by the elected members of state assemblies, not by direct public vote.\n\n**5. By-Elections:** Held when a seat becomes vacant due to death, resignation, or disqualification of a member.', icon: 'layers' },
  { order: 3, title: 'Who Can Vote?', content: 'Every Indian citizen who is 18 years or older on the qualifying date (January 1 of the year of revision of the electoral roll) is eligible to vote, provided they have registered as a voter.\n\n**Requirements:**\n- Must be an Indian citizen\n- Must be 18 years or older\n- Must be a resident of the constituency\n- Must possess a valid Voter ID (EPIC - Electors Photo Identity Card)\n- Must not be disqualified under any law (unsound mind, corrupt practices, etc.)\n\n**Important:** No person can vote at more than one constituency. You must register in the constituency where you ordinarily reside.\n\n**How to Register:** Visit the National Voters Service Portal (NVSP) at voters.eci.gov.in or use Form 6 at your local Electoral Registration Officer.', icon: 'user-check' },
  { order: 4, title: 'The Election Commission of India', content: 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering election processes in India. Established on 25th January 1950 (celebrated as National Voters Day), it operates under Article 324 of the Indian Constitution.\n\n**Structure:**\n- Chief Election Commissioner (CEC)\n- Two Election Commissioners\n- They enjoy same status as Supreme Court judges\n\n**Key Functions:**\n- Preparation and revision of electoral rolls\n- Notification of election schedules\n- Scrutiny of nominations\n- Allotment of election symbols\n- Implementation of Model Code of Conduct\n- Counting of votes and declaration of results\n- Settlement of election disputes\n\nThe ECI has the power to postpone or cancel elections in case of disruptions.', icon: 'shield' },
  { order: 5, title: 'The Election Process Timeline', content: 'The Indian election process follows a systematic timeline:\n\n**Phase 1 - Announcement:** ECI announces election dates. Model Code of Conduct (MCC) comes into effect immediately.\n\n**Phase 2 - Nominations (7 days):** Candidates file nomination papers with required documents and security deposit (₹25,000 for general, ₹12,500 for SC/ST candidates).\n\n**Phase 3 - Scrutiny:** Returning Officer examines nominations for validity.\n\n**Phase 4 - Withdrawal (2 days):** Candidates can withdraw nominations.\n\n**Phase 5 - Campaigning (ends 48 hours before voting):** Parties and candidates campaign. No campaigning allowed 48 hours before polling.\n\n**Phase 6 - Polling Day:** Voting takes place using EVMs and VVPATs. Polling stations open from 7 AM to 6 PM.\n\n**Phase 7 - Counting & Results:** Votes are counted, and results are declared constituency-wise.', icon: 'calendar' },
  { order: 6, title: 'Electronic Voting Machines (EVMs)', content: 'India uses Electronic Voting Machines (EVMs) for conducting elections, making the process faster, more accurate, and reducing invalid votes.\n\n**Components:**\n- **Ballot Unit (BU):** Where voters press the button next to their chosen candidate\n- **Control Unit (CU):** Operated by the presiding officer to enable voting\n- **VVPAT (Voter Verifiable Paper Audit Trail):** Prints a slip showing the candidate name and symbol for 7 seconds, allowing voter verification\n\n**Security Features:**\n- One-time programmable chips\n- No wireless connectivity\n- Battery operated (no external power needed)\n- Stores up to 2,000 votes\n- Tamper-proof sealing\n\n**NOTA Option:** Since 2013, EVMs include a "None of The Above" (NOTA) button, allowing voters to reject all candidates.', icon: 'monitor' },
  { order: 7, title: 'Model Code of Conduct', content: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into force the moment elections are announced.\n\n**Key Rules:**\n- No government can announce new policies, schemes, or projects that might influence voters\n- Ministers cannot combine official visits with campaign work\n- No party can use government resources for campaigning\n- Campaign speeches must not appeal to caste or communal feelings\n- No party or candidate can bribe voters with money, liquor, or gifts\n- Campaign silence period: 48 hours before polling\n- No victory processions after results\n\n**Violation:** Can lead to FIR, arrest, or disqualification of the candidate.', icon: 'book-open' },
  { order: 8, title: 'Voting Day: Step-by-Step', content: 'Here is what happens on polling day:\n\n**Step 1:** Arrive at your assigned polling booth (check your voter slip or ECI website)\n\n**Step 2:** Stand in the queue. Separate queues may exist for men, women, and senior citizens/disabled persons.\n\n**Step 3:** Present your Voter ID card (EPIC) or any of the 12 approved ID documents to the polling officer.\n\n**Step 4:** Your name is verified in the electoral roll. Indelible ink is applied to your left index finger.\n\n**Step 5:** The presiding officer activates the EVM for you.\n\n**Step 6:** Enter the voting compartment (secret voting). Press the button next to your chosen candidate on the ballot unit.\n\n**Step 7:** Check the VVPAT slip (displayed for 7 seconds) to confirm your vote was recorded correctly.\n\n**Step 8:** Exit the polling booth.\n\n**Tip:** Carry your voter slip to save time. Polling hours are typically 7 AM to 6 PM.', icon: 'check-circle' },
  { order: 9, title: 'Your Rights as a Voter', content: 'As an Indian voter, you have several important rights:\n\n**1. Right to Vote:** Every registered citizen above 18 can vote without discrimination.\n\n**2. Right to Secret Ballot:** Your vote is secret. No one can force you to reveal whom you voted for.\n\n**3. Right to Information:** You can access candidate affidavits containing criminal records, financial assets, and educational qualifications.\n\n**4. Right to Reject (NOTA):** You can choose "None of The Above" if you don\'t support any candidate.\n\n**5. Right to Complain:** You can report election malpractices to the Election Commission through cVIGIL app.\n\n**6. Right to Postal Ballot:** Service voters, disabled persons, and those above 80 years of age can apply for postal ballots.\n\n**7. Right to Accessibility:** Polling stations must be accessible to persons with disabilities. Braille ballot sheets and ramps must be provided.\n\n**8. Right to Challenge:** You can challenge suspicious voters at the polling station.', icon: 'scale' },
  { order: 10, title: 'Making Your Vote Count', content: 'Your vote is your voice! Here\'s how to make the most informed decision:\n\n**Research Candidates:**\n- Check candidate affidavits on ECI website for criminal records and assets\n- Attend public meetings and debates\n- Read party manifestos\n\n**Use Technology:**\n- **Voter Helpline App:** For voter registration, booth search, and complaints\n- **cVIGIL App:** Report election violations with photo/video evidence\n- **NVSP Portal:** Online voter registration and corrections\n\n**Community Participation:**\n- Encourage family and friends to vote\n- Volunteer as a polling agent or booth-level officer\n- Participate in SVEEP (Systematic Voters\' Education and Electoral Participation) activities\n\n**Remember:** Low voter turnout benefits those who rely on manipulation. A high turnout strengthens democracy. Every single vote matters — elections have been won and lost by single votes!\n\n**Helpline:** Call 1950 (ECI Helpline) for any election-related queries.', icon: 'trending-up' },
  { order: 11, title: 'Political Parties & Symbols', content: 'Political parties are the lifeblood of Indian democracy. The Election Commission of India (ECI) classifies parties into National and State parties based on their performance in previous elections. Currently, India has several recognized national parties and hundreds of state-level and registered unrecognized parties.\n\n**Symbol Allotment:** Every party is assigned a unique symbol. For national and state parties, these symbols are "reserved" and cannot be used by others. For unrecognized parties, the ECI provides a list of "free symbols" to choose from. Symbols are crucial in a country with varying literacy levels, as they help voters identify their choice easily.', icon: 'layers' },
  { order: 12, title: 'Election Manifestos', content: 'An election manifesto is a public declaration of policy and aims, issued by a political party before an election. It serves as a social contract between the party and the voters.\n\n**ECI Guidelines:** Manifestos must not contain anything repugnant to the Constitution. The ECI prohibits parties from making promises that might influence voters\' choice unduly or violate the Model Code of Conduct. Parties are required to submit their manifestos to the ECI to ensure transparency and accountability.', icon: 'book-open' },
  { order: 13, title: 'Role of Media & Exit Polls', content: 'Media plays a vital role as the fourth pillar of democracy during elections. It educates voters, provides a platform for debate, and monitors the conduct of parties.\n\n**Exit Polls vs Opinion Polls:** Opinion polls are conducted before voting begins, while exit polls are conducted after voters leave the polling booths. To prevent influence on voters during multi-phase elections, the ECI prohibits the publication of exit polls until the last phase of voting is completed across the country. "Paid news" and misinformation are strictly monitored by the ECI\'s Media Certification and Monitoring Committees (MCMC).', icon: 'monitor' },
  { order: 14, title: 'Delimitation of Constituencies', content: 'Delimitation is the act of redrawing boundaries of Lok Sabha and State Assembly constituencies based on the latest census data. This ensures that each representative represents a roughly equal number of citizens.\n\n**Delimitation Commission:** This task is performed by an independent Delimitation Commission, whose orders have the force of law and cannot be challenged in any court. The current boundaries are based on the 2001 census and are frozen until after the first census taken after 2026.', icon: 'shield' },
  { order: 15, title: 'Election Expenditure & Finance', content: 'To ensure a level playing field, the ECI sets limits on the amount a candidate can spend on their campaign. This limit varies between Lok Sabha and Assembly elections and between states.\n\n**Transparency:** Candidates must maintain a separate bank account for election expenses and submit a detailed account of their spending to the ECI within 30 days of the declaration of results. While there is a limit on candidate spending, there is currently no legal limit on the amount a political party can spend on general party propaganda.', icon: 'scale' },
  { order: 16, title: 'Election Observers', content: 'To ensure free and fair elections, the ECI appoints various types of observers who act as its eyes and ears on the ground.\n\n- **General Observers:** IAS officers who oversee the overall conduct of elections.\n- **Expenditure Observers:** IRS officers who monitor candidate spending and check for money power.\n- **Police Observers:** IPS officers who monitor law and order and the deployment of security forces.\n- **Micro-Observers:** Deployed at sensitive polling stations to monitor the process minutely.', icon: 'user-check' },
  { order: 17, title: 'Postal Ballots & ETPBS', content: 'While most people vote at polling stations, some categories of voters can use postal ballots. This includes "Service Voters" (members of armed forces, police serving outside their state), employees on election duty, and voters under preventive detention.\n\n**ETPBS:** The Electronically Transmitted Postal Ballot System (ETPBS) allows service voters to receive their ballot papers electronically, which they then print, mark, and mail back. Recently, the facility of postal ballots has been extended to senior citizens (80+) and Persons with Disabilities (PwD) to ensure their participation.', icon: 'calendar' },
  { order: 18, title: 'Security & Vulnerability Mapping', content: 'Ensuring a peaceful environment is critical for high voter turnout. The ECI, in coordination with state police and Central Armed Police Forces (CAPF), performs "Vulnerability Mapping" to identify areas where voters might be intimidated.\n\n**Measures:** Preventive arrests of known troublemakers, seizure of illegal arms and liquor, and heavy deployment of security forces in "critical" booths. The use of webcasting and CCTVs at polling stations further enhances security and transparency.', icon: 'shield' },
  { order: 19, title: 'Election Petitions & Disputes', content: 'If a candidate or voter believes that an election was not conducted fairly, they can challenge the result through an "Election Petition."\n\n**Process:** Unlike other legal matters, election disputes can only be raised *after* the election process is complete. These petitions are heard by the High Court of the respective state. Grounds for challenge include corrupt practices, improper rejection of nominations, or non-compliance with the Constitution.', icon: 'scale' },
  { order: 20, title: 'Local Self-Governance (Panchayats)', content: 'Democracy in India operates at three levels: Union, State, and Local. The 73rd and 74th Constitutional Amendments empowered Rural (Panchayats) and Urban (Municipalities) local bodies.\n\n**State Election Commission:** Unlike Lok Sabha and Assembly elections which are conducted by the ECI, local body elections are conducted by the respective State Election Commissions (SEC). These elections are the foundation of "grassroots democracy," bringing governance closer to the people.', icon: 'layers' }
];


const seedQuizzes = [
  { question: 'What is the minimum age to vote in India?', options: ['16', '18', '21', '25'], correct_answer: '18', difficulty: 'easy' },
  { question: 'Who conducts elections in India?', options: ['Prime Minister', 'Supreme Court', 'Election Commission of India', 'President'], correct_answer: 'Election Commission of India', difficulty: 'easy' },
  { question: 'What does EVM stand for?', options: ['Electronic Voting Machine', 'Election Verification Module', 'Electoral Voting Method', 'Electronic Voter Memory'], correct_answer: 'Electronic Voting Machine', difficulty: 'easy' },
  { question: 'When is National Voters Day celebrated?', options: ['26th January', '15th August', '25th January', '2nd October'], correct_answer: '25th January', difficulty: 'easy' },
  { question: 'What is the NOTA option on an EVM?', options: ['New Option for Total Audit', 'None of The Above', 'National Online Testing Authority', 'No Objection To Application'], correct_answer: 'None of The Above', difficulty: 'medium' },
  { question: 'How many members are elected to the Lok Sabha?', options: ['245', '543', '250', '500'], correct_answer: '543', difficulty: 'medium' },
  { question: 'What document is essential for voter identification?', options: ['Passport only', 'Aadhaar only', 'EPIC (Voter ID Card)', 'PAN Card only'], correct_answer: 'EPIC (Voter ID Card)', difficulty: 'easy' },
  { question: 'Under which Article of the Constitution is the Election Commission established?', options: ['Article 312', 'Article 324', 'Article 356', 'Article 370'], correct_answer: 'Article 324', difficulty: 'hard' },
  { question: 'What is the campaign silence period before polling?', options: ['24 hours', '48 hours', '72 hours', '12 hours'], correct_answer: '48 hours', difficulty: 'medium' },
  { question: 'What does VVPAT stand for?', options: ['Voter Verified Polling Audit Trail', 'Voter Verifiable Paper Audit Trail', 'Vote Verification and Paper Tracking', 'Virtual Voting and Paper Trail'], correct_answer: 'Voter Verifiable Paper Audit Trail', difficulty: 'medium' },
  { question: 'What is the security deposit for filing nomination in general elections?', options: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000'], correct_answer: '₹25,000', difficulty: 'hard' },
  { question: 'Which app can be used to report election violations?', options: ['UMANG', 'cVIGIL', 'DigiLocker', 'MyGov'], correct_answer: 'cVIGIL', difficulty: 'medium' },
  { question: 'In which year was the first general election held in India?', options: ['1947', '1949', '1950', '1951-52'], correct_answer: '1951-52', difficulty: 'medium' },
  { question: 'What is the Model Code of Conduct?', options: ['A law passed by Parliament', 'Guidelines by ECI for fair elections', 'A court order', 'A constitutional amendment'], correct_answer: 'Guidelines by ECI for fair elections', difficulty: 'easy' },
  { question: 'Who appoints the Chief Election Commissioner?', options: ['Prime Minister', 'Chief Justice of India', 'President of India', 'Vice President'], correct_answer: 'President of India', difficulty: 'hard' },
  { question: 'Which body assigns unique symbols to political parties in India?', options: ['Supreme Court', 'Parliament', 'Election Commission of India', 'President'], correct_answer: 'Election Commission of India', difficulty: 'easy' },
  { question: 'What is an "Election Manifesto"?', options: ['A secret party document', 'A public declaration of policy and aims', 'A list of criminal records', 'A budget report'], correct_answer: 'A public declaration of policy and aims', difficulty: 'easy' },
  { question: 'When can exit polls be published in a multi-phase election?', options: ['Immediately after each phase', '24 hours before voting', 'After the last phase of voting is over', 'On the day of counting'], correct_answer: 'After the last phase of voting is over', difficulty: 'medium' },
  { question: 'What is the primary task of the Delimitation Commission?', options: ['Counting votes', 'Allotting symbols', 'Redrawing constituency boundaries', 'Printing ballot papers'], correct_answer: 'Redrawing constituency boundaries', difficulty: 'medium' },
  { question: 'Within how many days must a candidate submit their election expenditure account?', options: ['7 days', '15 days', '30 days', '60 days'], correct_answer: '30 days', difficulty: 'hard' },
  { question: 'General Observers appointed by the ECI are typically officers from which service?', options: ['IPS', 'IRS', 'IAS', 'IFS'], correct_answer: 'IAS', difficulty: 'medium' },
  { question: 'What does ETPBS stand for?', options: ['Electronic Total Polling Board System', 'Electronically Transmitted Postal Ballot System', 'Electoral Tracking and Paper Ballot Service', 'Emergency Telephone Polling Backup System'], correct_answer: 'Electronically Transmitted Postal Ballot System', difficulty: 'hard' },
  { question: 'What is "Vulnerability Mapping" used for?', options: ['Finding new voters', 'Identifying areas prone to voter intimidation', 'Mapping booth locations', 'Tracking EVM movement'], correct_answer: 'Identifying areas prone to voter intimidation', difficulty: 'medium' },
  { question: 'Which judicial body hears Election Petitions?', options: ['District Court', 'High Court', 'Supreme Court only', 'Special Election Tribunal'], correct_answer: 'High Court', difficulty: 'hard' },
  { question: 'Who conducts elections for Panchayats and Municipalities?', options: ['Election Commission of India', 'State Election Commission', 'Governor', 'District Collector'], correct_answer: 'State Election Commission', difficulty: 'medium' }
].map((q, i) => ({ ...q, _id: (i + 1).toString() }));


// ──────────────────────────────────────
// MOCK DATABASE HANDLER
// ──────────────────────────────────────
let isUsingMock = false;
let mockModules = seedModules.map((m, i) => ({ ...m, _id: (i + 1).toString() }));
let mockQuizzes = seedQuizzes;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/election-assistant', {
  serverSelectionTimeoutMS: 2000, // Timeout after 2s if no DB
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.log('⚠️  MongoDB Connection Failed. Falling back to In-Memory Data Store.');
  isUsingMock = true;
});

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

// Models
const Module = require('./models/Module');
const Quiz = require('./models/Quiz');

// ──────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────

// Seed endpoint (supports GET for easy browser access)
app.get('/api/seed', async (req, res) => {
  try {
    if (isUsingMock) {
      mockModules = seedModules.map((m, i) => ({ ...m, _id: (i + 1).toString() }));
      mockQuizzes = seedQuizzes;
      return res.json({ message: 'In-memory store reset successfully' });
    }
    await Module.deleteMany({});
    await Quiz.deleteMany({});
    await Module.insertMany(seedModules);
    await Quiz.insertMany(seedQuizzes);
    res.json({ message: 'Database seeded successfully', modules: seedModules.length, quizzes: seedQuizzes.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Legacy POST seed support
app.post('/api/seed', async (req, res) => {
  try {
    if (isUsingMock) return res.json({ message: 'Using in-memory store' });
    await Module.deleteMany({});
    await Quiz.deleteMany({});
    await Module.insertMany(seedModules);
    await Quiz.insertMany(seedQuizzes);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Get all modules
app.get('/api/modules', async (req, res) => {
  try {
    if (isUsingMock) return res.json(mockModules);
    
    let modules = await Module.find().sort({ order: 1 });
    if (modules.length === 0) {
      await Module.insertMany(seedModules);
      modules = await Module.find().sort({ order: 1 });
    }
    res.json(modules);
  } catch (error) {
    console.error('Modules error:', error);
    // Fallback to mock on error
    res.json(mockModules);
  }
});

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    if (isUsingMock) return res.json(mockQuizzes);
    
    let quizzes = await Quiz.find();
    if (quizzes.length === 0) {
      await Quiz.insertMany(seedQuizzes);
      quizzes = await Quiz.find();
    }
    res.json(quizzes);
  } catch (error) {
    console.error('Quizzes error:', error);
    // Fallback to mock on error
    res.json(mockQuizzes);
  }
});

// Submit quiz answers
app.post('/api/quizzes/submit', async (req, res) => {
  const { answers } = req.body;
  try {
    const quizzes = isUsingMock ? mockQuizzes : await Quiz.find();
    let correct = 0;
    const results = [];

    for (const quiz of quizzes) {
      const userAnswer = answers[quiz._id.toString()];
      const isCorrect = userAnswer === quiz.correct_answer;
      if (isCorrect) correct++;
      results.push({
        question: quiz.question,
        userAnswer: userAnswer || 'Not answered',
        correctAnswer: quiz.correct_answer,
        isCorrect
      });
    }

    res.json({
      score: correct,
      total: quizzes.length,
      percentage: Math.round((correct / quizzes.length) * 100),
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate quiz' });
  }
});

// AI Chat - Ask about elections
/**
 * POST /api/ask
 * Handles AI-powered election queries using Google Gemini.
 * Includes security sanitization and structured system prompts.
 */
app.post('/api/ask', async (req, res) => {
  let { question } = req.body;
  
  // Security: Input Sanitization & Validation
  if (!question || typeof question !== 'string' || question.length < 3) {
    return res.status(400).json({ error: 'Please provide a valid question (min 3 characters).' });
  }
  
  // Limit input size for efficiency and security
  question = question.slice(0, 500).trim();

  try {
    // Check if Google AI is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      const fallbackResponses = {
        default: "I'm your Election Education Assistant! While the AI service is being configured, I can tell you that the Election Commission of India (ECI) oversees all elections in our country. India, the world's largest democracy, conducts elections using Electronic Voting Machines (EVMs) with VVPAT verification. Every citizen aged 18+ can register to vote.",
        vote: "To vote in India, you must be 18 years or older, an Indian citizen, and registered in the electoral roll. You'll need your Voter ID (EPIC) card. On polling day, visit your assigned booth, get your finger inked, and press the button next to your chosen candidate on the EVM.",
        evm: "EVMs (Electronic Voting Machines) have three parts: the Ballot Unit, the Control Unit, and the VVPAT. EVMs are battery-operated, tamper-proof, and can store up to 2,000 votes.",
        register: "You can register to vote through the NVSP portal (voters.eci.gov.in), the Voter Helpline App, or by submitting Form 6 to your local Electoral Registration Officer."
      };

      const q = question.toLowerCase();
      let answer = fallbackResponses.default;
      if (q.includes('vote') || q.includes('voting')) answer = fallbackResponses.vote;
      else if (q.includes('evm') || q.includes('machine')) answer = fallbackResponses.evm;
      else if (q.includes('register') || q.includes('enrollment')) answer = fallbackResponses.register;

      return res.json({ answer });
    }

    // Google Services: Enhanced Gemini Prompting
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are 'Nirvachak Assistant', an expert on the Indian Election Process. Provide accurate, non-partisan, and educational information. Use clear formatting with bullet points if needed. If a question is unrelated to elections, politely redirect the user."
    });

    const result = await model.generateContent(question);
    const responseText = result.response.text();
    
    res.json({ answer: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Security: Don't leak raw error details to the client
    res.status(500).json({ error: 'Our AI assistant is temporarily unavailable. Please try again later.' });
  }
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', usingMock: isUsingMock, timestamp: new Date().toISOString() });
});

// Catch-all route to serve frontend's index.html for client-side routing
app.get('/(.*)', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist', 'index.html');
  const fallbackPath = path.join(process.cwd(), 'frontend/dist', 'index.html');
  
  // Try sending the relative path first, then fallback to current working directory
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.sendFile(fallbackPath, (err2) => {
        if (err2) {
          res.status(404).send('Frontend not found. Please ensure the frontend is built.');
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🗳️  Election Assistant API running on port ${PORT}`);
});
