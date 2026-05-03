const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/election-assistant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

// Models
const Module = require('./models/Module');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

// ──────────────────────────────────────
// SEED DATA
// ──────────────────────────────────────
const seedModules = [
  {
    order: 1,
    title: 'What is an Election?',
    content: 'An election is a formal group decision-making process by which a population chooses an individual or political party to hold public office. In India, it is the world\'s largest democratic exercise, overseen by the Election Commission of India (ECI). Elections are the backbone of any democracy, ensuring that the power lies with the people. Through elections, citizens can choose their leaders, hold them accountable, and participate in governance.\n\nThe concept of elections dates back to ancient Greece, but modern democratic elections have evolved significantly. India adopted universal adult suffrage from its very first election in 1951-52, making it one of the most inclusive democracies from inception.',
    icon: 'vote'
  },
  {
    order: 2,
    title: 'Types of Elections in India',
    content: 'India conducts several types of elections:\n\n**1. General Elections (Lok Sabha):** Held every 5 years to elect 543 members of the lower house of Parliament. The party or coalition winning the majority forms the central government.\n\n**2. State Assembly Elections (Vidhan Sabha):** Conducted to elect members of state legislatures. Each state has its own assembly, and elections may not coincide with general elections.\n\n**3. Local Body Elections:** Include Panchayat elections (rural) and Municipal Corporation/Council elections (urban). These form the grassroots level of Indian democracy.\n\n**4. Rajya Sabha Elections:** Members are elected by the elected members of state assemblies, not by direct public vote.\n\n**5. By-Elections:** Held when a seat becomes vacant due to death, resignation, or disqualification of a member.',
    icon: 'layers'
  },
  {
    order: 3,
    title: 'Who Can Vote?',
    content: 'Every Indian citizen who is 18 years or older on the qualifying date (January 1 of the year of revision of the electoral roll) is eligible to vote, provided they have registered as a voter.\n\n**Requirements:**\n- Must be an Indian citizen\n- Must be 18 years or older\n- Must be a resident of the constituency\n- Must possess a valid Voter ID (EPIC - Electors Photo Identity Card)\n- Must not be disqualified under any law (unsound mind, corrupt practices, etc.)\n\n**Important:** No person can vote at more than one constituency. You must register in the constituency where you ordinarily reside.\n\n**How to Register:** Visit the National Voters Service Portal (NVSP) at voters.eci.gov.in or use Form 6 at your local Electoral Registration Officer.',
    icon: 'user-check'
  },
  {
    order: 4,
    title: 'The Election Commission of India',
    content: 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering election processes in India. Established on 25th January 1950 (celebrated as National Voters Day), it operates under Article 324 of the Indian Constitution.\n\n**Structure:**\n- Chief Election Commissioner (CEC)\n- Two Election Commissioners\n- They enjoy same status as Supreme Court judges\n\n**Key Functions:**\n- Preparation and revision of electoral rolls\n- Notification of election schedules\n- Scrutiny of nominations\n- Allotment of election symbols\n- Implementation of Model Code of Conduct\n- Counting of votes and declaration of results\n- Settlement of election disputes\n\nThe ECI has the power to postpone or cancel elections in case of disruptions.',
    icon: 'shield'
  },
  {
    order: 5,
    title: 'The Election Process Timeline',
    content: 'The Indian election process follows a systematic timeline:\n\n**Phase 1 - Announcement:** ECI announces election dates. Model Code of Conduct (MCC) comes into effect immediately.\n\n**Phase 2 - Nominations (7 days):** Candidates file nomination papers with required documents and security deposit (₹25,000 for general, ₹12,500 for SC/ST candidates).\n\n**Phase 3 - Scrutiny:** Returning Officer examines nominations for validity.\n\n**Phase 4 - Withdrawal (2 days):** Candidates can withdraw nominations.\n\n**Phase 5 - Campaigning (ends 48 hours before voting):** Parties and candidates campaign. No campaigning allowed 48 hours before polling.\n\n**Phase 6 - Polling Day:** Voting takes place using EVMs and VVPATs. Polling stations open from 7 AM to 6 PM.\n\n**Phase 7 - Counting & Results:** Votes are counted, and results are declared constituency-wise.',
    icon: 'calendar'
  },
  {
    order: 6,
    title: 'Electronic Voting Machines (EVMs)',
    content: 'India uses Electronic Voting Machines (EVMs) for conducting elections, making the process faster, more accurate, and reducing invalid votes.\n\n**Components:**\n- **Ballot Unit (BU):** Where voters press the button next to their chosen candidate\n- **Control Unit (CU):** Operated by the presiding officer to enable voting\n- **VVPAT (Voter Verifiable Paper Audit Trail):** Prints a slip showing the candidate name and symbol for 7 seconds, allowing voter verification\n\n**Security Features:**\n- One-time programmable chips\n- No wireless connectivity\n- Battery operated (no external power needed)\n- Stores up to 2,000 votes\n- Tamper-proof sealing\n\n**NOTA Option:** Since 2013, EVMs include a "None of The Above" (NOTA) button, allowing voters to reject all candidates.',
    icon: 'monitor'
  },
  {
    order: 7,
    title: 'Model Code of Conduct',
    content: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into force the moment elections are announced.\n\n**Key Rules:**\n- No government can announce new policies, schemes, or projects that might influence voters\n- Ministers cannot combine official visits with campaign work\n- No party can use government resources for campaigning\n- Campaign speeches must not appeal to caste or communal feelings\n- No party or candidate can bribe voters with money, liquor, or gifts\n- Campaign silence period: 48 hours before polling\n- No victory processions after results\n\n**Social Media:** The MCC now extends to social media. Political advertisements on platforms must be pre-certified by the Media Certification and Monitoring Committee (MCMC).\n\n**Violation:** Can lead to FIR, arrest, or disqualification of the candidate.',
    icon: 'book-open'
  },
  {
    order: 8,
    title: 'Voting Day: Step-by-Step',
    content: 'Here is what happens on polling day:\n\n**Step 1:** Arrive at your assigned polling booth (check your voter slip or ECI website)\n\n**Step 2:** Stand in the queue. Separate queues may exist for men, women, and senior citizens/disabled persons.\n\n**Step 3:** Present your Voter ID card (EPIC) or any of the 12 approved ID documents to the polling officer.\n\n**Step 4:** Your name is verified in the electoral roll. Indelible ink is applied to your left index finger.\n\n**Step 5:** The presiding officer activates the EVM for you.\n\n**Step 6:** Enter the voting compartment (secret voting). Press the button next to your chosen candidate on the ballot unit.\n\n**Step 7:** Check the VVPAT slip (displayed for 7 seconds) to confirm your vote was recorded correctly.\n\n**Step 8:** Exit the polling booth.\n\n**Tip:** Carry your voter slip to save time. Polling hours are typically 7 AM to 6 PM.',
    icon: 'check-circle'
  },
  {
    order: 9,
    title: 'Your Rights as a Voter',
    content: 'As an Indian voter, you have several important rights:\n\n**1. Right to Vote:** Every registered citizen above 18 can vote without discrimination.\n\n**2. Right to Secret Ballot:** Your vote is secret. No one can force you to reveal whom you voted for.\n\n**3. Right to Information:** You can access candidate affidavits containing criminal records, financial assets, and educational qualifications.\n\n**4. Right to Reject (NOTA):** You can choose "None of The Above" if you don\'t support any candidate.\n\n**5. Right to Complain:** You can report election malpractices to the Election Commission through cVIGIL app.\n\n**6. Right to Postal Ballot:** Service voters, disabled persons, and those above 80 years of age can apply for postal ballots.\n\n**7. Right to Accessibility:** Polling stations must be accessible to persons with disabilities. Braille ballot sheets and ramps must be provided.\n\n**8. Right to Challenge:** You can challenge suspicious voters at the polling station.',
    icon: 'scale'
  },
  {
    order: 10,
    title: 'Making Your Vote Count',
    content: 'Your vote is your voice! Here\'s how to make the most informed decision:\n\n**Research Candidates:**\n- Check candidate affidavits on ECI website for criminal records and assets\n- Attend public meetings and debates\n- Read party manifestos\n\n**Use Technology:**\n- **Voter Helpline App:** For voter registration, booth search, and complaints\n- **cVIGIL App:** Report election violations with photo/video evidence\n- **NVSP Portal:** Online voter registration and corrections\n\n**Community Participation:**\n- Encourage family and friends to vote\n- Volunteer as a polling agent or booth-level officer\n- Participate in SVEEP (Systematic Voters\' Education and Electoral Participation) activities\n\n**Remember:** Low voter turnout benefits those who rely on manipulation. A high turnout strengthens democracy. Every single vote matters — elections have been won and lost by single votes!\n\n**Helpline:** Call 1950 (ECI Helpline) for any election-related queries.',
    icon: 'trending-up'
  }
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
  { question: 'Who appoints the Chief Election Commissioner?', options: ['Prime Minister', 'Chief Justice of India', 'President of India', 'Vice President'], correct_answer: 'President of India', difficulty: 'hard' }
];

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    // Clear and reseed for fresh data
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

// ──────────────────────────────────────
// API ROUTES
// ──────────────────────────────────────

// Get all modules
app.get('/api/modules', async (req, res) => {
  try {
    let modules = await Module.find().sort({ order: 1 });
    // Auto-seed if empty
    if (modules.length === 0) {
      await Module.insertMany(seedModules);
      modules = await Module.find().sort({ order: 1 });
    }
    res.json(modules);
  } catch (error) {
    console.error('Modules error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single module
app.get('/api/modules/:id', async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) return res.status(404).json({ error: 'Module not found' });
    res.json(mod);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    let quizzes = await Quiz.find();
    // Auto-seed if empty
    if (quizzes.length === 0) {
      await Quiz.insertMany(seedQuizzes);
      quizzes = await Quiz.find();
    }
    res.json(quizzes);
  } catch (error) {
    console.error('Quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz answers
app.post('/api/quizzes/submit', async (req, res) => {
  const { answers } = req.body; // { quizId: selectedAnswer }
  try {
    const quizzes = await Quiz.find();
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
    console.error('Quiz submit error:', error);
    res.status(500).json({ error: 'Failed to evaluate quiz' });
  }
});

// AI Chat - Ask about elections
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Provide intelligent fallback responses
      const fallbackResponses = {
        default: "I'm your Election Education Assistant! While the AI service is being configured, I can tell you that the Election Commission of India (ECI) oversees all elections in our country. India, the world's largest democracy, conducts elections using Electronic Voting Machines (EVMs) with VVPAT verification. Every citizen aged 18+ can register to vote. Would you like to know more about any specific topic?",
        vote: "To vote in India, you must be 18 years or older, an Indian citizen, and registered in the electoral roll. You'll need your Voter ID (EPIC) card. On polling day, visit your assigned booth, get your finger inked, and press the button next to your chosen candidate on the EVM.",
        evm: "EVMs (Electronic Voting Machines) have three parts: the Ballot Unit (where you press your choice), the Control Unit (operated by the presiding officer), and the VVPAT (which prints a verification slip). EVMs are battery-operated, tamper-proof, and can store up to 2,000 votes.",
        register: "You can register to vote through the NVSP portal (voters.eci.gov.in), the Voter Helpline App, or by submitting Form 6 to your local Electoral Registration Officer. You need to be an Indian citizen and at least 18 years old."
      };

      const q = question.toLowerCase();
      let answer = fallbackResponses.default;
      if (q.includes('vote') || q.includes('voting')) answer = fallbackResponses.vote;
      else if (q.includes('evm') || q.includes('machine')) answer = fallbackResponses.evm;
      else if (q.includes('register') || q.includes('enrollment')) answer = fallbackResponses.register;

      return res.json({ answer });
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an Election Process Education Assistant helping an Indian user understand elections clearly and simply. Be friendly, informative, and use bullet points or numbered lists when appropriate. Keep answers concise but comprehensive. If the question is not related to elections, politely redirect the conversation to election topics.

Question: ${question}`
    });
    res.json({ answer: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to get answer from AI. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🗳️  Election Assistant API running on port ${PORT}`);
});
