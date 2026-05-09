#!/usr/bin/env node

/**
 * PrepGenie - COMPLETE MOCK TEST GENERATOR
 * FULL-LENGTH Mock Tests for ALL 59 Exams
 *
 * This is THE ONE - generates everything you need!
 * No need to run this again - one-time complete generation
 */

const fs = require('fs');
const path = require('path');

// Read API key
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const TOGETHER_API_KEY = envContent.match(/TOGETHER_API_KEY=(.+)/)?.[1]?.trim();

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

// COMPLETE EXAM CONFIGURATIONS - ALL 59 EXAMS WITH FULL-LENGTH TESTS
const ALL_EXAMS_FULL = {
  // === ENGINEERING (5 exams) ===
  'jee-main': {
    name: 'JEE Main', category: 'Engineering',
    numTests: 10, questionsPerTest: 75, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'jee-physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'] },
      { id: 'jee-chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'jee-maths', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors'] },
    ],
  },
  'jee-advanced': {
    name: 'JEE Advanced', category: 'Engineering',
    numTests: 10, questionsPerTest: 75, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'jee-adv-physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics'] },
      { id: 'jee-adv-chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'jee-adv-maths', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry'] },
    ],
  },
  'gate': {
    name: 'GATE CS', category: 'Engineering',
    numTests: 10, questionsPerTest: 65, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'gate-cs', name: 'Computer Science', count: 45, topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Networks', 'TOC', 'Compiler'] },
      { id: 'gate-aptitude', name: 'General Aptitude', count: 10, topics: ['Verbal Ability', 'Numerical Ability'] },
      { id: 'gate-engineering-math', name: 'Engineering Math', count: 10, topics: ['Linear Algebra', 'Calculus', 'Probability'] },
    ],
  },
  'nata': {
    name: 'NATA', category: 'Engineering',
    numTests: 5, questionsPerTest: 50, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'nata-maths', name: 'Mathematics', count: 25, topics: ['Algebra', 'Geometry', 'Trigonometry'] },
      { id: 'nata-aptitude', name: 'General Aptitude', count: 25, topics: ['Logical Reasoning', 'Visual Perception', 'Architectural Awareness'] },
    ],
  },
  'nid': {
    name: 'NID DAT', category: 'Engineering',
    numTests: 3, questionsPerTest: 60, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'nid-analytical', name: 'Analytical Ability', count: 30, topics: ['Logical Reasoning', 'Pattern Recognition', 'Problem Solving'] },
      { id: 'nid-gk', name: 'General Knowledge', count: 30, topics: ['Current Affairs', 'Design Awareness', 'Art & Culture'] },
    ],
  },

  // === MEDICAL (4 exams) ===
  'neet-ug': {
    name: 'NEET UG', category: 'Medical',
    numTests: 10, questionsPerTest: 180, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'neet-physics', name: 'Physics', count: 45, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'] },
      { id: 'neet-chemistry', name: 'Chemistry', count: 45, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'neet-biology', name: 'Biology (Zoology)', count: 45, topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology'] },
      { id: 'neet-botany', name: 'Biology (Botany)', count: 45, topics: ['Plant Physiology', 'Plant Anatomy', 'Plant Taxonomy'] },
    ],
  },
  'neet-pg': {
    name: 'NEET PG', category: 'Medical',
    numTests: 5, questionsPerTest: 200, timeLimit: 210, difficulty: 'hard',
    subjects: [
      { id: 'neet-pg-preclinical', name: 'Pre-clinical', count: 50, topics: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology'] },
      { id: 'neet-pg-clinical', name: 'Clinical', count: 100, topics: ['Medicine', 'Surgery', 'Obs & Gynae', 'Pediatrics', 'Orthopedics'] },
      { id: 'neet-pg-paraclinical', name: 'Para-clinical', count: 50, topics: ['Forensic Medicine', 'Community Medicine', 'Anesthesia', 'Radiology'] },
    ],
  },
  'aiims-nursing': {
    name: 'AIIMS Nursing', category: 'Medical',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'nursing-subject', name: 'Nursing', count: 70, topics: ['Fundamentals of Nursing', 'Medical-Surgical Nursing', 'Community Health', 'Child Health'] },
      { id: 'nursing-gk', name: 'General Knowledge', count: 30, topics: ['Current Affairs', 'General Science', 'Health Awareness'] },
    ],
  },
  'aipvt': {
    name: 'AIPVT (Veterinary)', category: 'Medical',
    numTests: 3, questionsPerTest: 180, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'aipvt-physics', name: 'Physics', count: 45, topics: ['Mechanics', 'Electromagnetism', 'Optics'] },
      { id: 'aipvt-chemistry', name: 'Chemistry', count: 45, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'aipvt-biology', name: 'Biology', count: 90, topics: ['Zoology', 'Botany', 'Veterinary Science'] },
    ],
  },

  // === CIVIL SERVICES (9 exams) ===
  'upsc-cse': {
    name: 'UPSC CSE Prelims', category: 'Civil Services',
    numTests: 15, questionsPerTest: 100, timeLimit: 120, difficulty: 'hard',
    subjects: [
      { id: 'upsc-gs', name: 'General Studies', count: 100, topics: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs', 'Science & Tech'] },
    ],
  },
  'uppsc': {
    name: 'UPPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'uppsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'UP Special'] },
    ],
  },
  'mppsc': {
    name: 'MPPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'mppsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'MP Special'] },
    ],
  },
  'tnpsc': {
    name: 'TNPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'tnpsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'TN Special'] },
    ],
  },
  'kpsc': {
    name: 'KPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'kpsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'Karnataka Special'] },
    ],
  },
  'bpsc': {
    name: 'BPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'bpsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'Bihar Special'] },
    ],
  },
  'rpsc': {
    name: 'RPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'rpsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'Rajasthan Special'] },
    ],
  },
  'wbpsc': {
    name: 'WBPSC', category: 'Civil Services',
    numTests: 5, questionsPerTest: 150, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'wbpsc-gs', name: 'General Studies', count: 150, topics: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs', 'WB Special'] },
    ],
  },
  'ifs': {
    name: 'IFS (Indian Forest Service)', category: 'Civil Services',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'hard',
    subjects: [
      { id: 'ifs-gs', name: 'General Studies', count: 100, topics: ['Environment', 'Ecology', 'Biodiversity', 'Forest Management', 'Geography', 'Current Affairs'] },
    ],
  },

  // === SSC (3 exams) ===
  'ssc-cgl': {
    name: 'SSC CGL', category: 'SSC',
    numTests: 10, questionsPerTest: 100, timeLimit: 60, difficulty: 'medium',
    subjects: [
      { id: 'ssc-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Blood Relations', 'Puzzles'] },
      { id: 'ssc-quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'] },
      { id: 'ssc-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'ssc-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography', 'Science'] },
    ],
  },
  'ssc-chsl': {
    name: 'SSC CHSL', category: 'SSC',
    numTests: 5, questionsPerTest: 100, timeLimit: 60, difficulty: 'medium',
    subjects: [
      { id: 'ssc-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding'] },
      { id: 'ssc-quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry'] },
      { id: 'ssc-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary'] },
      { id: 'ssc-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography'] },
    ],
  },
  'dsssb': {
    name: 'DSSSB', category: 'SSC',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'dsssb-gs', name: 'General Studies', count: 30, topics: ['Current Affairs', 'History', 'Geography', 'Polity'] },
      { id: 'dsssb-reasoning', name: 'Reasoning', count: 25, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'dsssb-english', name: 'English', count: 20, topics: ['Grammar', 'Vocabulary'] },
      { id: 'dsssb-arithmetic', name: 'Arithmetic', count: 25, topics: ['Number System', 'Percentage', 'Profit Loss'] },
    ],
  },

  // === BANKING (5 exams) ===
  'sbi-po': {
    name: 'SBI PO', category: 'Banking',
    numTests: 10, questionsPerTest: 100, timeLimit: 60, difficulty: 'medium',
    subjects: [
      { id: 'sbi-reasoning', name: 'Reasoning', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations'] },
      { id: 'sbi-quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic', 'Simplification'] },
      { id: 'sbi-english', name: 'English', count: 30, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
    ],
  },
  'ibps-po': {
    name: 'IBPS PO', category: 'Banking',
    numTests: 10, questionsPerTest: 100, timeLimit: 60, difficulty: 'medium',
    subjects: [
      { id: 'ibps-reasoning', name: 'Reasoning', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism'] },
      { id: 'ibps-quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic'] },
      { id: 'ibps-english', name: 'English', count: 30, topics: ['Reading Comprehension', 'Grammar'] },
    ],
  },
  'ibps-clerk': {
    name: 'IBPS Clerk', category: 'Banking',
    numTests: 5, questionsPerTest: 100, timeLimit: 60, difficulty: 'easy',
    subjects: [
      { id: 'ibps-reasoning', name: 'Reasoning', count: 35, topics: ['Puzzles', 'Seating Arrangement'] },
      { id: 'ibps-quant', name: 'Quantitative Aptitude', count: 35, topics: ['Arithmetic', 'Simplification'] },
      { id: 'ibps-english', name: 'English', count: 30, topics: ['Grammar', 'Vocabulary'] },
    ],
  },
  'rbi-grade-b': {
    name: 'RBI Grade B', category: 'Banking',
    numTests: 5, questionsPerTest: 100, timeLimit: 90, difficulty: 'hard',
    subjects: [
      { id: 'rbi-reasoning', name: 'Reasoning', count: 30, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism'] },
      { id: 'rbi-quant', name: 'Quantitative Aptitude', count: 30, topics: ['Data Interpretation', 'Arithmetic'] },
      { id: 'rbi-english', name: 'English', count: 30, topics: ['Reading Comprehension', 'Grammar'] },
      { id: 'rbi-ga', name: 'General Awareness', count: 10, topics: ['Banking Awareness', 'Current Affairs', 'Economy'] },
    ],
  },
  'lic-aao': {
    name: 'LIC AAO', category: 'Banking',
    numTests: 3, questionsPerTest: 100, timeLimit: 60, difficulty: 'medium',
    subjects: [
      { id: 'lic-reasoning', name: 'Reasoning', count: 30, topics: ['Puzzles', 'Syllogism'] },
      { id: 'lic-quant', name: 'Quantitative Aptitude', count: 30, topics: ['Arithmetic', 'Data Interpretation'] },
      { id: 'lic-english', name: 'English', count: 30, topics: ['Grammar', 'Comprehension'] },
      { id: 'lic-ga', name: 'General Awareness', count: 10, topics: ['Insurance Awareness', 'Current Affairs'] },
    ],
  },

  // === RAILWAYS (5 exams) ===
  'rrb-ntpc': {
    name: 'RRB NTPC', category: 'Railways',
    numTests: 5, questionsPerTest: 100, timeLimit: 90, difficulty: 'easy',
    subjects: [
      { id: 'rrb-maths', name: 'Mathematics', count: 35, topics: ['Arithmetic', 'Algebra', 'Geometry'] },
      { id: 'rrb-reasoning', name: 'Reasoning', count: 30, topics: ['Analogies', 'Series', 'Coding'] },
      { id: 'rrb-gk', name: 'General Awareness', count: 35, topics: ['Current Affairs', 'Science', 'Railways'] },
    ],
  },
  'rrb-group-d': {
    name: 'RRB Group D', category: 'Railways',
    numTests: 5, questionsPerTest: 100, timeLimit: 90, difficulty: 'easy',
    subjects: [
      { id: 'rrb-maths', name: 'Mathematics', count: 35, topics: ['Arithmetic', 'Number System'] },
      { id: 'rrb-reasoning', name: 'Reasoning', count: 30, topics: ['Analogies', 'Series'] },
      { id: 'rrb-gk', name: 'General Awareness', count: 35, topics: ['Current Affairs', 'Science'] },
    ],
  },
  'rrb-alp': {
    name: 'RRB ALP', category: 'Railways',
    numTests: 5, questionsPerTest: 100, timeLimit: 90, difficulty: 'medium',
    subjects: [
      { id: 'rrb-alp-maths', name: 'Mathematics', count: 30, topics: ['Arithmetic', 'Algebra'] },
      { id: 'rrb-alp-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series'] },
      { id: 'rrb-alp-ga', name: 'General Awareness', count: 25, topics: ['Current Affairs', 'Science'] },
      { id: 'rrb-alp-science', name: 'General Science', count: 20, topics: ['Physics', 'Chemistry'] },
    ],
  },
  'rrb-je': {
    name: 'RRB JE', category: 'Railways',
    numTests: 3, questionsPerTest: 100, timeLimit: 90, difficulty: 'medium',
    subjects: [
      { id: 'rrb-je-maths', name: 'Mathematics', count: 30, topics: ['Calculus', 'Algebra', 'Geometry'] },
      { id: 'rrb-je-reasoning', name: 'Reasoning', count: 25, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'rrb-je-technical', name: 'Technical', count: 45, topics: ['Engineering Subjects', 'Technical Knowledge'] },
    ],
  },
  'postal-assistant': {
    name: 'Postal Assistant', category: 'Railways',
    numTests: 3, questionsPerTest: 100, timeLimit: 60, difficulty: 'easy',
    subjects: [
      { id: 'pa-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series'] },
      { id: 'pa-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'Geography'] },
      { id: 'pa-quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Percentage'] },
      { id: 'pa-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary'] },
    ],
  },
  'gds': {
    name: 'GDS', category: 'Railways',
    numTests: 3, questionsPerTest: 100, timeLimit: 60, difficulty: 'easy',
    subjects: [
      { id: 'gds-maths', name: 'Mathematics', count: 40, topics: ['Arithmetic', 'Number System'] },
      { id: 'gds-reasoning', name: 'Reasoning', count: 30, topics: ['Analogies', 'Series'] },
      { id: 'gds-gk', name: 'General Knowledge', count: 30, topics: ['Current Affairs', 'General Science'] },
    ],
  },

  // === DEFENSE (8 exams) ===
  'nda': {
    name: 'NDA', category: 'Defense',
    numTests: 5, questionsPerTest: 120, timeLimit: 150, difficulty: 'medium',
    subjects: [
      { id: 'nda-maths', name: 'Mathematics', count: 60, topics: ['Algebra', 'Trigonometry', 'Calculus', 'Matrices', 'Vectors'] },
      { id: 'nda-gat', name: 'General Ability Test', count: 60, topics: ['English', 'General Knowledge', 'Physics', 'Chemistry', 'Geography'] },
    ],
  },
  'cds': {
    name: 'CDS', category: 'Defense',
    numTests: 5, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'cds-english', name: 'English', count: 34, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'cds-gk', name: 'General Knowledge', count: 33, topics: ['Current Affairs', 'History', 'Geography'] },
      { id: 'cds-maths', name: 'Elementary Mathematics', count: 33, topics: ['Arithmetic', 'Algebra', 'Geometry'] },
    ],
  },
  'afcat': {
    name: 'AFCAT', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'afcat-gk', name: 'General Knowledge', count: 30, topics: ['Current Affairs', 'Defense', 'History'] },
      { id: 'afcat-verbal', name: 'Verbal Ability', count: 25, topics: ['Grammar', 'Comprehension'] },
      { id: 'afcat-numerical', name: 'Numerical Ability', count: 25, topics: ['Arithmetic', 'Data Interpretation'] },
      { id: 'afcat-reasoning', name: 'Reasoning', count: 20, topics: ['Logical Reasoning', 'Spatial Ability'] },
    ],
  },
  'indian-navy': {
    name: 'Indian Navy', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'navy-maths', name: 'Mathematics', count: 35, topics: ['Algebra', 'Calculus', 'Trigonometry'] },
      { id: 'navy-physics', name: 'Physics', count: 35, topics: ['Mechanics', 'Electromagnetism', 'Thermodynamics'] },
      { id: 'navy-gk', name: 'General Knowledge', count: 30, topics: ['Current Affairs', 'Defense', 'Geography'] },
    ],
  },
  'indian-army': {
    name: 'Indian Army (TES/NCC)', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'army-maths', name: 'Mathematics', count: 35, topics: ['Algebra', 'Trigonometry'] },
      { id: 'army-physics', name: 'Physics', count: 35, topics: ['Mechanics', 'Optics'] },
      { id: 'army-chemistry', name: 'Chemistry', count: 30, topics: ['Physical Chemistry', 'Inorganic Chemistry'] },
    ],
  },
  'cisf': {
    name: 'CISF', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'easy',
    subjects: [
      { id: 'cisf-gk', name: 'General Knowledge', count: 40, topics: ['Current Affairs', 'History', 'Geography'] },
      { id: 'cisf-reasoning', name: 'Reasoning', count: 30, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'cisf-numerical', name: 'Numerical Ability', count: 30, topics: ['Arithmetic', 'Number System'] },
    ],
  },
  'up-police': {
    name: 'UP Police', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'easy',
    subjects: [
      { id: 'up-gk', name: 'General Knowledge', count: 40, topics: ['Current Affairs', 'UP GK', 'History'] },
      { id: 'up-reasoning', name: 'Reasoning', count: 30, topics: ['Logical Reasoning'] },
      { id: 'up-numerical', name: 'Numerical Ability', count: 30, topics: ['Arithmetic'] },
    ],
  },
  'delhi-police': {
    name: 'Delhi Police', category: 'Defense',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'easy',
    subjects: [
      { id: 'police-reasoning', name: 'Reasoning', count: 35, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'police-gk', name: 'General Knowledge', count: 35, topics: ['Current Affairs', 'Delhi GK'] },
      { id: 'police-numerical', name: 'Numerical Ability', count: 30, topics: ['Arithmetic', 'Number System'] },
    ],
  },

  // === MANAGEMENT (3 exams) ===
  'cat': {
    name: 'CAT', category: 'Management',
    numTests: 10, questionsPerTest: 66, timeLimit: 120, difficulty: 'hard',
    subjects: [
      { id: 'cat-varc', name: 'Verbal Ability & Reading Comprehension', count: 22, topics: ['Reading Comprehension', 'Grammar', 'Para Jumbles'] },
      { id: 'cat-dilr', name: 'Data Interpretation & Logical Reasoning', count: 22, topics: ['Data Interpretation', 'Logical Reasoning', 'Puzzles'] },
      { id: 'cat-quant', name: 'Quantitative Aptitude', count: 22, topics: ['Arithmetic', 'Algebra', 'Geometry'] },
    ],
  },
  'xat': {
    name: 'XAT', category: 'Management',
    numTests: 5, questionsPerTest: 100, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'xat-quant', name: 'Quantitative Aptitude', count: 28, topics: ['Arithmetic', 'Algebra', 'Geometry'] },
      { id: 'xat-verbal', name: 'Verbal Ability', count: 26, topics: ['Reading Comprehension', 'Grammar'] },
      { id: 'xat-decision', name: 'Decision Making', count: 21, topics: ['Ethical Reasoning', 'Situational Judgment'] },
      { id: 'xat-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'Business Awareness'] },
    ],
  },
  'nchmct': {
    name: 'NCHMCT JEE', category: 'Management',
    numTests: 3, questionsPerTest: 100, timeLimit: 180, difficulty: 'medium',
    subjects: [
      { id: 'nchmct-numerical', name: 'Numerical Ability', count: 25, topics: ['Arithmetic', 'Algebra'] },
      { id: 'nchmct-reasoning', name: 'Reasoning', count: 25, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'nchmct-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'Hospitality Awareness'] },
      { id: 'nchmct-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary'] },
    ],
  },

  // === LAW (4 exams) ===
  'clat': {
    name: 'CLAT', category: 'Law',
    numTests: 5, questionsPerTest: 120, timeLimit: 120, difficulty: 'hard',
    subjects: [
      { id: 'clat-english', name: 'English', count: 30, topics: ['Comprehension', 'Grammar', 'Vocabulary'] },
      { id: 'clat-gk', name: 'Current Affairs & GK', count: 30, topics: ['Current Affairs', 'Static GK', 'Legal GK'] },
      { id: 'clat-legal', name: 'Legal Reasoning', count: 30, topics: ['Legal Principles', 'Case Studies'] },
      { id: 'clat-logical', name: 'Logical Reasoning', count: 30, topics: ['Syllogism', 'Analytical Reasoning'] },
    ],
  },
  'ailet': {
    name: 'AILET', category: 'Law',
    numTests: 3, questionsPerTest: 100, timeLimit: 90, difficulty: 'hard',
    subjects: [
      { id: 'ailet-english', name: 'English', count: 25, topics: ['Comprehension', 'Grammar'] },
      { id: 'ailet-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'Legal GK'] },
      { id: 'ailet-legal', name: 'Legal Aptitude', count: 30, topics: ['Legal Reasoning', 'Legal Principles'] },
      { id: 'ailet-reasoning', name: 'Reasoning', count: 20, topics: ['Logical Reasoning', 'Analytical Ability'] },
    ],
  },
  'judicial-services': {
    name: 'Judicial Services', category: 'Law',
    numTests: 3, questionsPerTest: 150, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'jud-law', name: 'Law', count: 100, topics: ['Constitutional Law', 'Criminal Law', 'Civil Law', 'Contract Law'] },
      { id: 'jud-gk', name: 'General Knowledge', count: 50, topics: ['Current Affairs', 'Legal GK', 'History'] },
    ],
  },
  'iimc': {
    name: 'IIMC', category: 'Law',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'iimc-ga', name: 'General Awareness', count: 50, topics: ['Current Affairs', 'Media Awareness', 'Mass Communication'] },
      { id: 'iimc-english', name: 'English', count: 50, topics: ['Grammar', 'Comprehension', 'Writing Skills'] },
    ],
  },

  // === TEACHING (6 exams) ===
  'ctet': {
    name: 'CTET', category: 'Teaching',
    numTests: 5, questionsPerTest: 150, timeLimit: 150, difficulty: 'easy',
    subjects: [
      { id: 'ctet-child-dev', name: 'Child Development & Pedagogy', count: 30, topics: ['Child Psychology', 'Learning Theories', 'Pedagogy'] },
      { id: 'ctet-language-1', name: 'Language I', count: 30, topics: ['Comprehension', 'Grammar', 'Pedagogy'] },
      { id: 'ctet-language-2', name: 'Language II', count: 30, topics: ['Comprehension', 'Grammar'] },
      { id: 'ctet-maths', name: 'Mathematics & Pedagogy', count: 30, topics: ['Number System', 'Arithmetic', 'Geometry'] },
      { id: 'ctet-evs', name: 'Environmental Studies', count: 30, topics: ['Environment', 'Social Studies', 'Science'] },
    ],
  },
  'htet': {
    name: 'HTET', category: 'Teaching',
    numTests: 3, questionsPerTest: 150, timeLimit: 150, difficulty: 'easy',
    subjects: [
      { id: 'htet-cdp', name: 'Child Development', count: 30, topics: ['Child Psychology', 'Learning Theories'] },
      { id: 'htet-english', name: 'English', count: 30, topics: ['Grammar', 'Comprehension'] },
      { id: 'htet-hindi', name: 'Hindi', count: 30, topics: ['Grammar', 'Comprehension'] },
      { id: 'htet-gk', name: 'General Knowledge', count: 30, topics: ['Haryana GK', 'Current Affairs'] },
      { id: 'htet-maths', name: 'Mathematics', count: 30, topics: ['Arithmetic', 'Algebra'] },
    ],
  },
  'uptet': {
    name: 'UPTET', category: 'Teaching',
    numTests: 3, questionsPerTest: 150, timeLimit: 150, difficulty: 'easy',
    subjects: [
      { id: 'uptet-cdp', name: 'Child Development', count: 30, topics: ['Child Psychology'] },
      { id: 'uptet-english', name: 'English', count: 30, topics: ['Grammar', 'Comprehension'] },
      { id: 'uptet-hindi', name: 'Hindi', count: 30, topics: ['Grammar', 'Comprehension'] },
      { id: 'uptet-maths', name: 'Mathematics', count: 30, topics: ['Arithmetic'] },
      { id: 'uptet-evs', name: 'Environmental Studies', count: 30, topics: ['Environment', 'Science'] },
    ],
  },
  'rtet': {
    name: 'RTET', category: 'Teaching',
    numTests: 3, questionsPerTest: 150, timeLimit: 150, difficulty: 'easy',
    subjects: [
      { id: 'rtet-cdp', name: 'Child Development', count: 30, topics: ['Child Psychology'] },
      { id: 'rtet-maths', name: 'Mathematics', count: 30, topics: ['Arithmetic', 'Geometry'] },
      { id: 'rtet-science', name: 'Science', count: 30, topics: ['Physics', 'Chemistry', 'Biology'] },
      { id: 'rtet-social', name: 'Social Studies', count: 30, topics: ['History', 'Geography', 'Civics'] },
      { id: 'rtet-language', name: 'Language', count: 30, topics: ['Hindi', 'English'] },
    ],
  },
  'ugc-net': {
    name: 'UGC NET', category: 'Teaching',
    numTests: 5, questionsPerTest: 150, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'ugc-teaching', name: 'Teaching Aptitude', count: 50, topics: ['Teaching Methods', 'Learning Psychology', 'Evaluation'] },
      { id: 'ugc-reasoning', name: 'Research & Reasoning', count: 50, topics: ['Research Methodology', 'Logical Reasoning', 'Data Interpretation'] },
      { id: 'ugc-comprehension', name: 'Comprehension & Communication', count: 50, topics: ['Reading Comprehension', 'Communication Skills', 'ICT'] },
    ],
  },
  'kvs': {
    name: 'KVS', category: 'Teaching',
    numTests: 3, questionsPerTest: 150, timeLimit: 150, difficulty: 'medium',
    subjects: [
      { id: 'kvs-gs', name: 'General Studies', count: 50, topics: ['Current Affairs', 'History', 'Geography', 'Science'] },
      { id: 'kvs-reasoning', name: 'Reasoning', count: 50, topics: ['Logical Reasoning', 'Analytical Ability'] },
      { id: 'kvs-subject', name: 'Subject Knowledge', count: 50, topics: ['Teaching Subject', 'Pedagogy'] },
    ],
  },

  // === PROFESSIONAL (4 exams) ===
  'ca-foundation': {
    name: 'CA Foundation', category: 'Professional',
    numTests: 5, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'ca-accounts', name: 'Accounting', count: 34, topics: ['Financial Accounting', 'Accounting Standards', 'Ledger'] },
      { id: 'ca-law', name: 'Business Laws', count: 33, topics: ['Contract Law', 'Company Law', 'Business Regulations'] },
      { id: 'ca-maths', name: 'Business Mathematics', count: 33, topics: ['Ratio', 'Percentage', 'Statistics', 'Permutation'] },
    ],
  },
  'cs-foundation': {
    name: 'CS Foundation', category: 'Professional',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'cs-business-economics', name: 'Business Economics', count: 34, topics: ['Microeconomics', 'Macroeconomics', 'Indian Economy'] },
      { id: 'cs-business-env', name: 'Business Environment', count: 33, topics: ['Business Organization', 'Management', 'Ethics'] },
      { id: 'cs-fundamentals', name: 'Fundamentals of Accounting', count: 33, topics: ['Accounting Principles', 'Financial Statements'] },
    ],
  },
  'gpat': {
    name: 'GPAT', category: 'Professional',
    numTests: 3, questionsPerTest: 125, timeLimit: 180, difficulty: 'hard',
    subjects: [
      { id: 'gpat-pharma', name: 'Pharmaceutics', count: 42, topics: ['Dosage Forms', 'Drug Delivery', 'Biopharmaceutics'] },
      { id: 'gpat-pharmaco', name: 'Pharmacology', count: 42, topics: ['Pharmacodynamics', 'Pharmacokinetics', 'Toxicology'] },
      { id: 'gpat-chem', name: 'Pharmaceutical Chemistry', count: 41, topics: ['Medicinal Chemistry', 'Organic Chemistry', 'Drug Analysis'] },
    ],
  },
  'icar-aieea': {
    name: 'ICAR AIEEA', category: 'Professional',
    numTests: 3, questionsPerTest: 150, timeLimit: 150, difficulty: 'medium',
    subjects: [
      { id: 'icar-physics', name: 'Physics', count: 50, topics: ['Mechanics', 'Electromagnetism', 'Modern Physics'] },
      { id: 'icar-chemistry', name: 'Chemistry', count: 50, topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
      { id: 'icar-biology', name: 'Biology/Agriculture', count: 50, topics: ['Botany', 'Zoology', 'Agriculture', 'Biotechnology'] },
    ],
  },

  // === OTHERS (7 exams) ===
  'nift': {
    name: 'NIFT', category: 'Others',
    numTests: 3, questionsPerTest: 100, timeLimit: 120, difficulty: 'medium',
    subjects: [
      { id: 'nift-gat', name: 'General Ability Test', count: 50, topics: ['Communication', 'Analytical Ability', 'General Knowledge'] },
      { id: 'nift-creative', name: 'Creative Ability Test', count: 50, topics: ['Design Awareness', 'Creativity', 'Visual Perception'] },
    ],
  },
  'isi': {
    name: 'ISI Admission Test', category: 'Others',
    numTests: 3, questionsPerTest: 100, timeLimit: 150, difficulty: 'hard',
    subjects: [
      { id: 'isi-maths', name: 'Mathematics', count: 50, topics: ['Calculus', 'Algebra', 'Probability', 'Linear Algebra'] },
      { id: 'isi-stats', name: 'Statistics', count: 50, topics: ['Probability', 'Statistical Inference', 'Data Analysis'] },
    ],
  },
};

// Calculate totals
const totalTests = Object.values(ALL_EXAMS_FULL).reduce((sum, exam) => sum + exam.numTests, 0);
const totalQuestions = Object.values(ALL_EXAMS_FULL).reduce((sum, exam) => sum + (exam.numTests * exam.questionsPerTest), 0);
const estimatedTime = Math.ceil(totalQuestions / 10); // ~10 questions per minute with batching
const estimatedCost = (totalQuestions * 0.00007).toFixed(2);

console.log('╔═════════════════════════════════════════════════════════════════════╗');
console.log('║       PrepGenie - COMPLETE FULL-LENGTH MOCK TEST GENERATOR         ║');
console.log('║                  ALL 59 EXAMS - ONE TIME GENERATION                 ║');
console.log('╚═════════════════════════════════════════════════════════════════════╝\n');

console.log(`🎯 COMPLETE TARGET:`);
console.log(`   📚 Total Exams: ${Object.keys(ALL_EXAMS_FULL).length}`);
console.log(`   📝 Total Mock Tests: ${totalTests}`);
console.log(`   ❓ Total Questions: ${totalQuestions.toLocaleString()}`);
console.log(`   ⏱️  Estimated Time: ~${Math.floor(estimatedTime / 60)}h ${estimatedTime % 60}m`);
console.log(`   💰 Estimated Cost: ~$${estimatedCost} (uses $5 free credit)\n`);

console.log(`📊 BREAKDOWN BY CATEGORY:\n`);

const categories = {};
Object.entries(ALL_EXAMS_FULL).forEach(([id, exam]) => {
  if (!categories[exam.category]) {
    categories[exam.category] = { exams: 0, tests: 0, questions: 0 };
  }
  categories[exam.category].exams++;
  categories[exam.category].tests += exam.numTests;
  categories[exam.category].questions += (exam.numTests * exam.questionsPerTest);
});

Object.entries(categories).sort((a, b) => b[1].questions - a[1].questions).forEach(([category, stats]) => {
  console.log(`   ${category}:`);
  console.log(`      - ${stats.exams} exams, ${stats.tests} tests, ${stats.questions.toLocaleString()} questions`);
});

// Generate question function
async function generateQuestion(examName, subjectName, topic, difficulty) {
  const prompt = `Generate a ${difficulty} difficulty MCQ question for ${examName} exam.

Subject: ${subjectName}
Topic: ${topic}

CRITICAL RULES:
- Use ONLY plain English text
- NO LaTeX, NO backslashes, NO special symbols (°, ², α, β, etc.)
- Write "degree" not "°", write "squared" not "²", write "alpha" not "α"
- NO math notation like \\frac, \\sqrt, \\pi - use words
- Keep it simple and readable

Requirements:
- Match real ${examName} exam pattern
- Exactly 4 options
- Correct answer: 0-3
- Detailed explanation (100+ words)

Return ONLY valid JSON (no markdown, no code blocks):
{
  "question": "Clear question in plain English",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed step-by-step explanation in plain English"
}`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    let content = data.choices[0].message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.question || !parsed.options || parsed.options.length !== 4) return null;

    return parsed;
  } catch (error) {
    return null;
  }
}

// Generate mock test
async function generateMockTest(examConfig, testNumber) {
  console.log(`\n📝 ${examConfig.name} - Test ${testNumber}/${examConfig.numTests} (${examConfig.questionsPerTest}Q)...`);

  const allQuestions = [];
  const batchSize = 15;

  for (const subject of examConfig.subjects) {
    process.stdout.write(`  📚 ${subject.name} (${subject.count}Q): `);

    const questionsPerTopic = Math.ceil(subject.count / subject.topics.length);
    const requests = [];

    for (const topic of subject.topics) {
      for (let i = 0; i < questionsPerTopic && requests.length < subject.count; i++) {
        requests.push({ topic, subjectName: subject.name, subjectId: subject.id });
      }
    }

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const promises = batch.map(req =>
        generateQuestion(examConfig.name, req.subjectName, req.topic, examConfig.difficulty)
      );

      const results = await Promise.all(promises);

      results.forEach((result, idx) => {
        if (result) {
          allQuestions.push({
            question: result.question,
            option_a: result.options[0],
            option_b: result.options[1],
            option_c: result.options[2],
            option_d: result.options[3],
            correct_answer: result.correctAnswer || 0,
            explanation: result.explanation,
            difficulty: examConfig.difficulty,
            exam_id: examConfig.id,
            subject_id: batch[idx].subjectId,
            topic: batch[idx].topic,
            year: 'AI Generated 2026',
            source_detail: 'Together AI - Qwen 2.5 7B - Full Mock Test',
            source_type: 'ai-practice',
            verified: false,
          });
          process.stdout.write('✓');
        } else {
          process.stdout.write('✗');
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(` DONE`);
  }

  return allQuestions;
}

// Save to CSV
function saveToCSV(questions, examId) {
  const outputDir = path.join(__dirname, '..', '.agents', 'artifacts', 'complete-mock-tests');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${examId}-complete-mock-tests.csv`;
  const filepath = path.join(outputDir, filename);

  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';

  let csv = header;
  questions.forEach(q => {
    csv += [
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.option_a.replace(/"/g, '""')}"`,
      `"${q.option_b.replace(/"/g, '""')}"`,
      `"${q.option_c.replace(/"/g, '""')}"`,
      `"${q.option_d.replace(/"/g, '""')}"`,
      q.correct_answer,
      `"${q.explanation.replace(/"/g, '""')}"`,
      q.difficulty,
      q.exam_id,
      q.subject_id,
      `"${q.topic.replace(/"/g, '""')}"`,
      q.year,
      `"${q.source_detail.replace(/"/g, '""')}"`,
      q.source_type,
      q.verified
    ].join(',') + '\n';
  });

  fs.writeFileSync(filepath, csv);
  return filepath;
}

// Save progress
function saveProgress(progress) {
  const progressFile = path.join(__dirname, '..', '.agents', 'artifacts', 'generation-progress.json');
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

// Load progress
function loadProgress() {
  const progressFile = path.join(__dirname, '..', '.agents', 'artifacts', 'generation-progress.json');
  if (fs.existsSync(progressFile)) {
    return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  }
  return {};
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const startTime = Date.now();
  let totalGenerated = 0;
  const completed = loadProgress();

  if (args.length === 0 || args[0] === 'all') {
    console.log(`\n🚀 Starting COMPLETE generation for ALL 59 exams...\n`);
    console.log(`Progress will be saved. You can stop and resume anytime.\n`);

    for (const [examId, examConfig] of Object.entries(ALL_EXAMS_FULL)) {
      if (completed[examId]) {
        console.log(`\n✓ Skipping ${examConfig.name} (already completed)`);
        continue;
      }

      const config = { ...examConfig, id: examId };
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📋 ${config.name} (${config.category}) - ${config.numTests} tests × ${config.questionsPerTest}Q = ${config.numTests * config.questionsPerTest} total`);
      console.log('='.repeat(80));

      const allQuestions = [];

      for (let testNum = 1; testNum <= config.numTests; testNum++) {
        const questions = await generateMockTest(config, testNum);
        allQuestions.push(...questions);
        totalGenerated += questions.length;
      }

      const filepath = saveToCSV(allQuestions, examId);
      completed[examId] = { questions: allQuestions.length, file: filepath, timestamp: new Date().toISOString() };
      saveProgress(completed);

      console.log(`\n  ✅ ${config.name}: ${allQuestions.length} questions → ${path.basename(filepath)}`);
    }

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n\n╔═════════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ COMPLETE GENERATION FINISHED! ✅                       ║');
    console.log('╚═════════════════════════════════════════════════════════════════════╝\n');

    const totalFilesGenerated = Object.keys(completed).length;
    const totalQuestionsGenerated = Object.values(completed).reduce((sum, item) => sum + item.questions, 0);

    console.log(`🎉 FINAL SUMMARY:`);
    console.log(`   ✅ Exams Completed: ${totalFilesGenerated}/${Object.keys(ALL_EXAMS_FULL).length}`);
    console.log(`   ✅ Questions Generated: ${totalQuestionsGenerated.toLocaleString()}`);
    console.log(`   ⏱️  Time Taken: ${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m ${duration % 60}s`);
    console.log(`   📁 Output: .agents/artifacts/complete-mock-tests/\n`);

    console.log(`📦 Next Step: Import to database`);
    console.log(`   Run: node scripts/import-all-complete-mock-tests.js\n`);

  } else {
    const examId = args[0];
    const examConfig = { ...ALL_EXAMS_FULL[examId], id: examId };

    if (!examConfig.name) {
      console.error(`❌ Unknown exam: ${examId}`);
      console.log('\nAvailable exams:');
      Object.keys(ALL_EXAMS_FULL).forEach(id => console.log(`  - ${id}`));
      process.exit(1);
    }

    console.log(`\n📋 Generating ${examConfig.name}...\n`);

    const allQuestions = [];
    for (let testNum = 1; testNum <= examConfig.numTests; testNum++) {
      const questions = await generateMockTest(examConfig, testNum);
      allQuestions.push(...questions);
    }

    const filepath = saveToCSV(allQuestions, examId);
    console.log(`\n✅ Generated ${allQuestions.length} questions → ${filepath}\n`);
  }
}

main().catch(console.error);
