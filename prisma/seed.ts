import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
const connectionString = process.env.DATABASE_URL || 'file:./dev.db';

let adapter: any;
if (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://')) {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString });
  adapter = new PrismaPg(pool);
} else {
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const dbPath = path.join(process.cwd(), 'dev.db');
  const url = 'file:' + dbPath;
  adapter = new PrismaBetterSqlite3({ url });
}

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin
  const adminUsername = 'admin';
  const adminPassword = 'coreengineersadmin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { password: hashedPassword },
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });
  console.log('Admin seeded successfully. Username: admin, Password: coreengineersadmin123');

  // 2. Seed Notes & Resources
  const notesData = [
    // CSE - Semester 3
    {
      title: 'Data Structures & Algorithms - Complete Lecture Notes',
      subject: 'Data Structures & Algorithms (PC-CS301)',
      semester: 3,
      branch: 'CSE',
      category: 'Notes',
      fileUrl: '/uploads/cse_s3_dsa_notes.pdf',
      fileType: 'pdf',
      downloadCount: 142,
      viewCount: 310,
    },
    {
      title: 'Computer Organization & Architecture - Previous Year Solved Paper (2022-2023)',
      subject: 'Computer Organization & Architecture (PC-CS302)',
      semester: 3,
      branch: 'CSE',
      category: 'PYQ',
      fileUrl: '/uploads/cse_s3_coa_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 95,
      viewCount: 180,
    },
    {
      title: 'Discrete Mathematics - Semester Exam High-Yield Suggestions',
      subject: 'Discrete Mathematics (BS-M301)',
      semester: 3,
      branch: 'CSE',
      category: 'Suggestions',
      fileUrl: '/uploads/cse_s3_discrete_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 220,
      viewCount: 450,
    },
    {
      title: 'Digital Electronics - Complete Syllabus Copy & Formula Sheet',
      subject: 'Analog & Digital Electronics (ES-CS301)',
      semester: 3,
      branch: 'CSE',
      category: 'Syllabus',
      fileUrl: '/uploads/cse_s3_digital_syllabus.pdf',
      fileType: 'pdf',
      downloadCount: 50,
      viewCount: 120,
    },

    // CSE - Semester 4
    {
      title: 'Design & Analysis of Algorithms - Chapterwise Handwritten Notes',
      subject: 'Design & Analysis of Algorithms (PC-CS401)',
      semester: 4,
      branch: 'CSE',
      category: 'Notes',
      fileUrl: '/uploads/cse_s4_daa_notes.pdf',
      fileType: 'pdf',
      downloadCount: 165,
      viewCount: 340,
    },
    {
      title: 'Operating Systems - Last 5 Years Solved Pyqs Compilation',
      subject: 'Operating Systems (PC-CS402)',
      semester: 4,
      branch: 'CSE',
      category: 'PYQ',
      fileUrl: '/uploads/cse_s4_os_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 189,
      viewCount: 380,
    },
    {
      title: 'Formal Language & Automata Theory - Exam suggestions & Practice Problems',
      subject: 'Formal Language & Automata Theory (PC-CS403)',
      semester: 4,
      branch: 'CSE',
      category: 'Suggestions',
      fileUrl: '/uploads/cse_s4_flat_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 130,
      viewCount: 290,
    },

    // ECE - Semester 3
    {
      title: 'Network Theory - Core Concept Notes & Solved Numericals',
      subject: 'Network Theory (PC-EC301)',
      semester: 3,
      branch: 'ECE',
      category: 'Notes',
      fileUrl: '/uploads/ece_s3_network_notes.pdf',
      fileType: 'pdf',
      downloadCount: 104,
      viewCount: 220,
    },
    {
      title: 'Signals & Systems - Semester Exam suggestions',
      subject: 'Signals & Systems (PC-EC302)',
      semester: 3,
      branch: 'ECE',
      category: 'Suggestions',
      fileUrl: '/uploads/ece_s3_signals_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 112,
      viewCount: 230,
    },
    {
      title: 'Digital System Design - Previous Year Question Papers (2019-2023)',
      subject: 'Digital System Design (PC-EC304)',
      semester: 3,
      branch: 'ECE',
      category: 'PYQ',
      fileUrl: '/uploads/ece_s3_dsd_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 88,
      viewCount: 195,
    },

    // ECE - Semester 4
    {
      title: 'Microprocessors & Microcontrollers - 8085/8086 Assembly Notes',
      subject: 'Microprocessors & Microcontrollers (PC-EC401)',
      semester: 4,
      branch: 'ECE',
      category: 'Notes',
      fileUrl: '/uploads/ece_s4_micro_notes.pdf',
      fileType: 'pdf',
      downloadCount: 145,
      viewCount: 290,
    },
    {
      title: 'Analog Communication - High-Yield suggestions for Semester Exam',
      subject: 'Analog Communication (PC-EC403)',
      semester: 4,
      branch: 'ECE',
      category: 'Suggestions',
      fileUrl: '/uploads/ece_s4_comm_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 97,
      viewCount: 210,
    },
    {
      title: 'Electromagnetic Waves - Solved PYQ Compilation',
      subject: 'Electromagnetic Waves (PC-EC402)',
      semester: 4,
      branch: 'ECE',
      category: 'PYQ',
      fileUrl: '/uploads/ece_s4_emw_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 76,
      viewCount: 175,
    },

    // ME - Semester 3
    {
      title: 'Engineering Thermodynamics - Complete Formula Book & Concept Notes',
      subject: 'Thermodynamics (PC-ME301)',
      semester: 3,
      branch: 'ME',
      category: 'Notes',
      fileUrl: '/uploads/me_s3_thermo_notes.pdf',
      fileType: 'pdf',
      downloadCount: 89,
      viewCount: 190,
    },
    {
      title: 'Strength of Materials - Solved Exam Problems & Suggestions',
      subject: 'Strength of Materials (PC-ME302)',
      semester: 3,
      branch: 'ME',
      category: 'Suggestions',
      fileUrl: '/uploads/me_s3_som_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 120,
      viewCount: 245,
    },
    {
      title: 'Fluid Mechanics - Previous Year Solved Questions',
      subject: 'Fluid Mechanics (PC-ME303)',
      semester: 3,
      branch: 'ME',
      category: 'PYQ',
      fileUrl: '/uploads/me_s3_fluid_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 78,
      viewCount: 160,
    },

    // ME - Semester 4
    {
      title: 'Applied Thermodynamics - Steam Tables & Cycle analysis Notes',
      subject: 'Applied Thermodynamics (PC-ME401)',
      semester: 4,
      branch: 'ME',
      category: 'Notes',
      fileUrl: '/uploads/me_s4_applied_thermo_notes.pdf',
      fileType: 'pdf',
      downloadCount: 101,
      viewCount: 205,
    },
    {
      title: 'Kinematics & Theory of Machines - Semester Exam Suggestions',
      subject: 'Kinematics & Theory of Machines (PC-ME402)',
      semester: 4,
      branch: 'ME',
      category: 'Suggestions',
      fileUrl: '/uploads/me_s4_ktom_suggestions.pdf',
      fileType: 'pdf',
      downloadCount: 93,
      viewCount: 190,
    },
    {
      title: 'Manufacturing Processes - Lecture Notes & PYQ Answers',
      subject: 'Manufacturing Processes (PC-ME403)',
      semester: 4,
      branch: 'ME',
      category: 'PYQ',
      fileUrl: '/uploads/me_s4_manufacturing_pyq.pdf',
      fileType: 'pdf',
      downloadCount: 85,
      viewCount: 180,
    },
  ];

  for (const note of notesData) {
    await prisma.note.create({
      data: note,
    });
  }
  console.log(`Successfully seeded ${notesData.length} Notes & Resources.`);

  // 3. Seed Courses & Videos
  const coursesData = [
    {
      title: 'Data Structures and Algorithms for Beginners',
      description: 'Master the fundamentals of Data Structures and Algorithms. This course covers Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, and Searching, with special focus on MAKAUT exam patterns and coding interviews.',
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_yf5Yh8FOBcx-jZuUpD',
      duration: '15 Hours',
      videos: [
        {
          title: 'Introduction to Data Structures & Algorithms',
          videoUrl: 'https://www.youtube.com/embed/zWg7U0OEAoE',
          notesUrl: '/uploads/cse_s3_dsa_notes.pdf',
        },
        {
          title: 'Pointers & Dynamic Memory Allocation in C',
          videoUrl: 'https://www.youtube.com/embed/d3gdVZu0A1w',
          notesUrl: '/uploads/cse_s3_dsa_notes.pdf',
        },
        {
          title: 'Understanding Arrays and Linked Lists',
          videoUrl: 'https://www.youtube.com/embed/oxy52C16Cyc',
          notesUrl: '/uploads/cse_s3_dsa_notes.pdf',
        },
      ],
    },
    {
      title: 'MAKAUT Engineering Mathematics-I',
      description: 'Comprehensive video tutorials covering Calculus, Linear Algebra, Sequence and Series, Multivariable Calculus, and Vector Spaces, built specifically to target the MAKAUT 1st-year curriculum.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLm_MSClsnWM9j-b_jV8P2j3wH_wQh27T_',
      duration: '22 Hours',
      videos: [
        {
          title: 'Matrix Algebra - Eigenvalues and Eigenvectors',
          videoUrl: 'https://www.youtube.com/embed/R3-1S8E9o2I',
          notesUrl: '/uploads/cse_s3_discrete_suggestions.pdf',
        },
        {
          title: 'Successive Differentiation & Leibniz Theorem',
          videoUrl: 'https://www.youtube.com/embed/14QzN4wL2-M',
          notesUrl: '/uploads/cse_s3_discrete_suggestions.pdf',
        },
        {
          title: 'Mean Value Theorems & Taylor Series',
          videoUrl: 'https://www.youtube.com/embed/8yV1k4XoGms',
          notesUrl: '/uploads/cse_s3_discrete_suggestions.pdf',
        },
      ],
    },
    {
      title: 'Basic Electrical Engineering - Core Concepts',
      description: 'Clear, step-by-step explanations of DC Circuits, AC Circuits, Transformers, Electrical Machines, and Power Systems. Perfect for clearing backlogs and scoring high in MAKAUT semester exams.',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      playlistUrl: 'https://www.youtube.com/playlist?list=PL9RcWoqXmzaLdM7t7A7A8-A_S8OqH_w68',
      duration: '18 Hours',
      videos: [
        {
          title: 'Kirchhoff\'s Laws (KVL & KCL) in DC Circuits',
          videoUrl: 'https://www.youtube.com/embed/m5_P0N-DqFk',
          notesUrl: '/uploads/ece_s3_network_notes.pdf',
        },
        {
          title: 'Mesh and Nodal Analysis with Practical Examples',
          videoUrl: 'https://www.youtube.com/embed/K857nQGzC2Q',
          notesUrl: '/uploads/ece_s3_network_notes.pdf',
        },
        {
          title: 'Single Phase AC Circuits - RLC Series Circuit',
          videoUrl: 'https://www.youtube.com/embed/hB55s53Ld4Q',
          notesUrl: '/uploads/ece_s3_network_notes.pdf',
        },
      ],
    },
  ];

  for (const course of coursesData) {
    const { videos, ...courseInfo } = course;
    const createdCourse = await prisma.course.create({
      data: courseInfo,
    });

    for (const video of videos) {
      await prisma.video.create({
        data: {
          ...video,
          courseId: createdCourse.id,
        },
      });
    }
  }
  console.log(`Successfully seeded ${coursesData.length} Courses and associated Video lessons.`);

  // 4. Seed Blog Posts
  const blogPostsData = [
    {
      title: 'How to Prepare for MAKAUT Semester Exams: The 8.5+ SGPA Blueprint',
      content: `
        <p>Scoring a high GPA in Maulana Abul Kalam Azad University of Technology (MAKAUT) exams does not require studying 12 hours a day. It requires studying smart. Since the evaluation structure relies heavily on specific patterns, mastering this blueprint will guarantee you excellent scores.</p>
        
        <h3>1. Deconstruct the Question Paper Pattern</h3>
        <p>MAKAUT question papers are divided into three distinct groups:</p>
        <ul>
          <li><strong>Group A (MCQs):</strong> 10-12 marks. These are scoring. Go through previous 5-10 years MCQs as they are frequently repeated.</li>
          <li><strong>Group B (Short Answers):</strong> 15 marks (3 out of 5 questions, 5 marks each). Keep these concise, use equations, and draw small labeled block diagrams.</li>
          <li><strong>Group C (Long Answers):</strong> 45 marks (3 out of 5 questions, 15 marks each). These are multi-part questions (e.g., 8+7 marks or 5+5+5 marks). Choose questions that are numerical-heavy as they fetch full marks.</li>
        </ul>

        <h3>2. Make the "Organon" or PYQ Book Your Bible</h3>
        <p>Around 60-70% of the questions in MAKAUT exams are directly or indirectly derived from the previous 5 to 7 years' questions. Make sure to purchase a solved scanner or compile PYQ solutions yourself. Solve at least the last 5 years' papers before entering the exam hall.</p>

        <h3>3. Write for the Examiner</h3>
        <p>MAKAUT examiners evaluate hundreds of sheets. Make their job easy:</p>
        <ul>
          <li>Use black ink for headings and blue for main text.</li>
          <li>Never write long, solid paragraphs. Break them into bullet points with underlined key phrases.</li>
          <li>Draw neat schematics. Even if your theory explanation is short, a correct diagram tells the examiner you understand the concept.</li>
        </ul>

        <h3>4. Focus on MAR Points early</h3>
        <p>Remember that your final degree requires 100 Mandatory Additional Requirements (MAR) points. Do not scramble in the final year; attend webinars, code contests, and online courses during semesters 2, 3, and 4 to build these up.</p>
      `,
      category: 'Exam Prep',
      tags: 'MAKAUT, Exam Tips, Study Guide, SGPA',
      imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'MAKAUT to FAANG: Placement Roadmap for Tier-3 College Students',
      content: `
        <p>Getting a high-paying software job from a MAKAUT-affiliated college requires an off-campus strategy. Since top product companies rarely visit tier-3 colleges for on-campus placements, you must create your own path. Here is the step-by-step roadmap.</p>
        
        <h3>Phase 1: Master one Coding Language & DSA (Semesters 1-4)</h3>
        <p>Pick either C++, Java, or Python. Do not jump between languages. Master core Data Structures (Arrays, Linked Lists, Stacks, Queues, HashMaps, Trees, Graphs) and Algorithms (Sorting, Searching, Recursion, Dynamic Programming). Spend at least 6 months solving problems on platforms like LeetCode or GeeksforGeeks.</p>

        <h3>Phase 2: Build 2 Strong Development Projects (Semesters 5-6)</h3>
        <p>Choose a domain: Web Development (MERN/Next.js), Mobile App Dev (Flutter/React Native), or Systems Programming. Build two non-generic projects. Instead of a basic "To-Do List", make a real-world clone with actual payments, chat options, or database synchronization. Upload the code to GitHub and write a detailed README file.</p>

        <h3>Phase 3: Optimize Your Resume & Portfolio</h3>
        <p>Create a single-page resume using the Harvard or Deedy layout. Highlight your technical skills, DSA contest ratings (LeetCode, Codeforces), and project links. Add links to your GitHub and LinkedIn profiles.</p>

        <h3>Phase 4: Cold Outreach and Referral Network</h3>
        <p>Apply directly on company portals rarely gets a response due to ATS filters. Instead, search LinkedIn for software engineers working at target companies (Google, Amazon, Microsoft, Uber). Send a polite message sharing your profile, work, and requesting a referral for open entry-level positions.</p>
      `,
      category: 'Career',
      tags: 'Placements, FAANG, DSA, Resume Guide',
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Demystifying the MAKAUT Credit System and MAR points',
      content: `
        <p>Many first and second-year engineering students under MAKAUT are confused by the credit-based grading structure, MOOCs guidelines, and MAR certifications. Let's break down the rules clearly so you don't face issues during graduation registration.</p>

        <h3>1. The Credit Point Allocation</h3>
        <p>A typical B.Tech degree requires around 160 total credits across 8 semesters. Each subject is allocated credits (usually 3 or 4 for theory, and 1 or 2 for labs). Your SGPA (Semester Grade Point Average) is calculated by multiplying your grade in each subject by its credit, summing them up, and dividing by total credits. This means failing a 4-credit subject affects your CGPA heavily compared to a 1-credit lab.</p>

        <h3>2. What is MAR (Mandatory Additional Requirements)?</h3>
        <p>To receive an Honours degree, MAKAUT requires every student to earn 100 MAR points across their 4 years. For a regular degree, it is still mandatory to earn points (typically 75 points). Points are awarded for activities outside academic syllabus:</p>
        <ul>
          <li><strong>Online Courses (NPTEL/Coursera):</strong> 10-20 points per certificate.</li>
          <li><strong>Sports & Yoga:</strong> 10-20 points.</li>
          <li><strong>Tree Plantation/Community Service:</strong> 10 points (requires photographic proof and certificates).</li>
          <li><strong>Hackathons & Coding Contests:</strong> 10-30 points depending on participation level.</li>
          <li><strong>Technical Publications:</strong> 20 points.</li>
        </ul>

        <h3>3. MOOCs (Massive Open Online Courses) Regulations</h3>
        <p>Under the new MAKAUT guidelines, students who want B.Tech with Honours must earn an extra 20 credits through NPTEL/Swayam online courses. These courses must be chosen from the approved MAKAUT list corresponding to your branch. Make sure to register for these exams on time and submit certifications to your college portal.</p>
      `,
      category: 'Roadmap',
      tags: 'MAKAUT, MAR Points, Credit System, MOOCs',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.create({
      data: post,
    });
  }
  console.log(`Successfully seeded ${blogPostsData.length} Guidance & Blog posts.`);

  // 5. Create some default files in /public/uploads so download works
  console.log('Creating sample resource files in /public/uploads...');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (const note of notesData) {
    const filePath = path.join(process.cwd(), 'public', note.fileUrl);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        `CORE ENGINEERS HUB - MAKAUT STUDY RESOURCES\n` +
        `==================================================\n\n` +
        `TITLE: ${note.title}\n` +
        `SUBJECT: ${note.subject}\n` +
        `BRANCH: ${note.branch}\n` +
        `SEMESTER: Semester ${note.semester}\n` +
        `CATEGORY: ${note.category}\n\n` +
        `--------------------------------------------------\n` +
        `This file is a real educational placeholder note compiled by Core Engineers Hub.\n` +
        `It serves as study guidance content for ${note.subject} for students under MAKAUT.\n` +
        `You can manage, edit, upload, or delete this file via the admin panel of this platform.\n` +
        `Enjoy learning and all the best for your exams!\n`
      );
    }
  }
  console.log('Seeding process completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
