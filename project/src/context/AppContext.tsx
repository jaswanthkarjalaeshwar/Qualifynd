import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type UserRole = 'recruiter' | 'hiring_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'draft' | 'active' | 'closed';
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  keywords: string[];
  experienceLevel: string;
  createdAt: Date;
  createdBy: string;
  applicantCount: number;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  customAnswers: Record<string, string>;
  automaticScore: number;
  manualScore: number;
  overallScore: number;
  bucket: 'yes' | 'maybe' | 'no' | 'pending';
  stage: 'applied' | 'screening' | 'interview' | 'final' | 'rejected' | 'hired';
  comments: Comment[];
  appliedAt: Date;
  lastUpdated: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

interface AppState {
  currentUser: User;
  jobs: JobPost[];
  applicants: Applicant[];
}

type AppAction = 
  | { type: 'ADD_JOB'; payload: JobPost }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<JobPost> } }
  | { type: 'ADD_APPLICANT'; payload: Applicant }
  | { type: 'UPDATE_APPLICANT'; payload: { id: string; updates: Partial<Applicant> } }
  | { type: 'ADD_COMMENT'; payload: { applicantId: string; comment: Comment } }
  | { type: 'BULK_UPDATE_APPLICANTS'; payload: { ids: string[]; updates: Partial<Applicant> } };

const initialState: AppState = {
  currentUser: {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'recruiter'
  },
  jobs: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      status: 'active',
      description: 'We are looking for a Senior Software Engineer to join our growing engineering team and help build scalable solutions that impact millions of users.',
      responsibilities: [
        'Design and develop scalable web applications using modern technologies',
        'Collaborate with cross-functional teams to deliver high-quality products',
        'Mentor junior engineers and contribute to technical architecture decisions',
        'Lead code reviews and maintain high coding standards across the team'
      ],
      qualifications: [
        '5+ years of software development experience with strong problem-solving skills',
        'Expert proficiency in React, Node.js, TypeScript, and modern web technologies',
        'Experience with cloud platforms (AWS, GCP) and containerization technologies',
        'Bachelor\'s degree in Computer Science or equivalent practical experience'
      ],
      benefits: [
        'Competitive salary package with equity participation',
        'Comprehensive health, dental, and vision insurance coverage',
        'Flexible work arrangements with remote-first culture',
        '401(k) retirement plan with generous company matching'
      ],
      keywords: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Docker', 'Kubernetes'],
      experienceLevel: 'Senior',
      createdAt: new Date('2024-01-15'),
      createdBy: '1',
      applicantCount: 38
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'full-time',
      status: 'active',
      description: 'Seeking an experienced Product Manager to drive product strategy and execution for our core platform, working closely with engineering and design teams.',
      responsibilities: [
        'Define and execute comprehensive product roadmap and strategic initiatives',
        'Collaborate closely with engineering, design, and marketing teams',
        'Conduct in-depth market research and user interviews to inform decisions',
        'Analyze product metrics, user feedback, and competitive landscape'
      ],
      qualifications: [
        '3+ years of product management experience in fast-paced environments',
        'Strong analytical and problem-solving skills with data-driven approach',
        'Experience with agile development methodologies and product lifecycle',
        'MBA or equivalent experience in product management preferred'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Premium health, dental, and vision insurance',
        'Unlimited PTO and flexible remote work options',
        '$2,000 annual professional development budget'
      ],
      keywords: ['Product Management', 'Agile', 'Analytics', 'Strategy', 'User Research'],
      experienceLevel: 'Mid-level',
      createdAt: new Date('2024-01-20'),
      createdBy: '1',
      applicantCount: 22
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'full-time',
      status: 'draft',
      description: 'Join our design team to create intuitive and beautiful user experiences that delight our customers and drive business growth.',
      responsibilities: [
        'Create user-centered design solutions through research and testing',
        'Develop wireframes, prototypes, and high-fidelity mockups',
        'Collaborate with product and engineering teams on implementation',
        'Maintain and evolve our design system and component library'
      ],
      qualifications: [
        '3+ years of UX/UI design experience with strong portfolio',
        'Proficiency in Figma, Sketch, and modern design tools',
        'Experience with user research methodologies and usability testing',
        'Understanding of front-end development principles and constraints'
      ],
      benefits: [
        'Competitive compensation with performance bonuses',
        'Top-tier health and wellness benefits',
        'Creative workspace with latest design tools and equipment',
        'Conference attendance and learning opportunities'
      ],
      keywords: ['UX Design', 'UI Design', 'Figma', 'User Research', 'Prototyping'],
      experienceLevel: 'Mid-level',
      createdAt: new Date('2024-01-25'),
      createdBy: '1',
      applicantCount: 0
    }
  ],
  applicants: [
    // Senior Software Engineer applicants
    {
      id: '1',
      jobId: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      resumeUrl: '#',
      coverLetter: 'I am excited to apply for the Senior Software Engineer position at your company. With over 6 years of experience in full-stack development, I have successfully led multiple projects using React, Node.js, and cloud technologies. I am particularly drawn to your company\'s mission and the opportunity to work on scalable solutions that impact millions of users.',
      customAnswers: {
        'Why do you want to work here?': 'I am passionate about building scalable systems and working with cutting-edge technology. Your company\'s commitment to innovation and technical excellence aligns perfectly with my career goals.',
        'What motivates you?': 'Solving complex technical challenges and mentoring other developers. I thrive in collaborative environments where I can both contribute and learn from talented teammates.'
      },
      automaticScore: 88,
      manualScore: 92,
      overallScore: 90,
      bucket: 'yes',
      stage: 'interview',
      comments: [
        {
          id: '1',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Excellent technical background with strong React and Node.js experience. Communication skills were impressive during initial screening call. Recommend moving to technical interview.',
          createdAt: new Date('2024-01-22')
        }
      ],
      appliedAt: new Date('2024-01-18'),
      lastUpdated: new Date('2024-01-22')
    },
    {
      id: '2',
      jobId: '1',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '+1 (555) 987-6543',
      resumeUrl: '#',
      coverLetter: 'As a passionate software engineer with expertise in React and Node.js, I am thrilled to apply for the Senior Software Engineer role. My experience includes building high-performance web applications and leading development teams in agile environments.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s mission to create impactful technology solutions aligns with my values. I\'m excited about the technical challenges and the opportunity to work with a talented engineering team.',
        'What motivates you?': 'Creating software that improves people\'s lives and solving complex problems through elegant code. I enjoy the collaborative aspect of software development and continuous learning.'
      },
      automaticScore: 82,
      manualScore: 85,
      overallScore: 84,
      bucket: 'maybe',
      stage: 'screening',
      comments: [
        {
          id: '2',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Good technical skills but less senior experience than ideal. Strong cultural fit and enthusiasm. Worth a deeper technical discussion.',
          createdAt: new Date('2024-01-21')
        }
      ],
      appliedAt: new Date('2024-01-19'),
      lastUpdated: new Date('2024-01-21')
    },
    {
      id: '3',
      jobId: '1',
      name: 'Jennifer Liu',
      email: 'jennifer.liu@email.com',
      phone: '+1 (555) 234-5678',
      resumeUrl: '#',
      coverLetter: 'I am excited to apply for the Senior Software Engineer position. With 7 years of experience in full-stack development and a track record of leading successful projects, I am confident I can contribute significantly to your engineering team.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s reputation for technical excellence and innovation is well-known in the industry. I want to be part of a team that pushes the boundaries of what\'s possible.',
        'What motivates you?': 'Building products that users love and solving challenging technical problems. I\'m motivated by the opportunity to mentor others and contribute to a positive engineering culture.'
      },
      automaticScore: 91,
      manualScore: 88,
      overallScore: 90,
      bucket: 'yes',
      stage: 'screening',
      comments: [],
      appliedAt: new Date('2024-01-24'),
      lastUpdated: new Date('2024-01-24')
    },
    {
      id: '4',
      jobId: '1',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
      resumeUrl: '#',
      coverLetter: 'With 4 years of experience in software development, I am eager to take the next step in my career as a Senior Software Engineer. I have worked extensively with React and Node.js in my current role.',
      customAnswers: {
        'Why do you want to work here?': 'I admire your company\'s innovative approach to technology and would love to contribute to your mission.',
        'What motivates you?': 'Learning new technologies and working on challenging projects that make a real impact.'
      },
      automaticScore: 75,
      manualScore: 70,
      overallScore: 73,
      bucket: 'no',
      stage: 'applied',
      comments: [],
      appliedAt: new Date('2024-01-26'),
      lastUpdated: new Date('2024-01-26')
    },
    {
      id: '5',
      jobId: '1',
      name: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      phone: '+1 (555) 456-7890',
      resumeUrl: '#',
      coverLetter: 'I am a senior software engineer with 8 years of experience building scalable web applications. I have led teams and architected solutions for high-traffic applications.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s focus on scalability and performance aligns perfectly with my expertise and interests.',
        'What motivates you?': 'Architecting elegant solutions to complex problems and mentoring junior developers.'
      },
      automaticScore: 94,
      manualScore: 90,
      overallScore: 92,
      bucket: 'yes',
      stage: 'final',
      comments: [
        {
          id: '3',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Outstanding candidate with excellent technical depth and leadership experience. Strong recommendation for final round.',
          createdAt: new Date('2024-01-27')
        }
      ],
      appliedAt: new Date('2024-01-25'),
      lastUpdated: new Date('2024-01-27')
    },
    {
      id: '6',
      jobId: '1',
      name: 'David Park',
      email: 'david.park@email.com',
      phone: '+1 (555) 567-8901',
      resumeUrl: '#',
      coverLetter: 'As a software engineer with 3 years of experience, I am looking to grow into a senior role. I have experience with React and am eager to learn more about Node.js.',
      customAnswers: {
        'Why do you want to work here?': 'I want to work for a company that values growth and learning.',
        'What motivates you?': 'Continuous learning and building great products.'
      },
      automaticScore: 68,
      manualScore: 65,
      overallScore: 67,
      bucket: 'no',
      stage: 'rejected',
      comments: [],
      appliedAt: new Date('2024-01-23'),
      lastUpdated: new Date('2024-01-24')
    },
    {
      id: '7',
      jobId: '1',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 678-9012',
      resumeUrl: '#',
      coverLetter: 'I am a passionate software engineer with 5 years of experience in full-stack development. I have worked with React, Node.js, and various cloud platforms.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s commitment to innovation and technical excellence is inspiring.',
        'What motivates you?': 'Building software that makes a positive impact and working with talented teams.'
      },
      automaticScore: 85,
      manualScore: 82,
      overallScore: 84,
      bucket: 'maybe',
      stage: 'interview',
      comments: [],
      appliedAt: new Date('2024-01-28'),
      lastUpdated: new Date('2024-01-29')
    },
    {
      id: '8',
      jobId: '1',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 789-0123',
      resumeUrl: '#',
      coverLetter: 'With 6 years of experience in software engineering, I have developed expertise in React, Node.js, and cloud technologies. I am excited about the opportunity to contribute to your team.',
      customAnswers: {
        'Why do you want to work here?': 'I am drawn to your company\'s mission and the opportunity to work on challenging technical problems.',
        'What motivates you?': 'Solving complex problems and building scalable solutions.'
      },
      automaticScore: 87,
      manualScore: 85,
      overallScore: 86,
      bucket: 'yes',
      stage: 'screening',
      comments: [],
      appliedAt: new Date('2024-01-29'),
      lastUpdated: new Date('2024-01-29')
    },
    {
      id: '9',
      jobId: '1',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 890-1234',
      resumeUrl: '#',
      coverLetter: 'I am a senior software engineer with 9 years of experience leading development teams and architecting large-scale applications. I specialize in React, Node.js, and AWS.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s reputation for technical excellence and innovation makes it an ideal place for my next career move.',
        'What motivates you?': 'Leading technical initiatives and mentoring other engineers to achieve their full potential.'
      },
      automaticScore: 96,
      manualScore: 94,
      overallScore: 95,
      bucket: 'yes',
      stage: 'hired',
      comments: [
        {
          id: '4',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Exceptional candidate with outstanding technical skills and leadership experience. Offer extended and accepted.',
          createdAt: new Date('2024-01-30')
        }
      ],
      appliedAt: new Date('2024-01-27'),
      lastUpdated: new Date('2024-01-30')
    },
    {
      id: '10',
      jobId: '1',
      name: 'Robert Garcia',
      email: 'robert.garcia@email.com',
      phone: '+1 (555) 901-2345',
      resumeUrl: '#',
      coverLetter: 'I am interested in the Senior Software Engineer position. I have 2 years of experience with JavaScript and am learning React.',
      customAnswers: {
        'Why do you want to work here?': 'I want to work for a growing company where I can learn and develop my skills.',
        'What motivates you?': 'Learning new technologies and growing as a developer.'
      },
      automaticScore: 55,
      manualScore: 50,
      overallScore: 53,
      bucket: 'no',
      stage: 'applied',
      comments: [],
      appliedAt: new Date('2024-01-30'),
      lastUpdated: new Date('2024-01-30')
    },
    // Product Manager applicants
    {
      id: '11',
      jobId: '2',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 456-7890',
      resumeUrl: '#',
      coverLetter: 'I am writing to express my strong interest in the Product Manager role. With 4 years of product management experience at high-growth startups, I have successfully launched multiple products and driven significant user growth through data-driven decision making.',
      customAnswers: {
        'Why do you want to work here?': 'I admire your product innovation and user-centric approach. The opportunity to work on products that scale to millions of users while maintaining quality is exactly what I\'m looking for in my next role.',
        'Describe your product management philosophy': 'I believe in combining data-driven insights with deep user empathy. Success comes from understanding user needs, validating assumptions through experimentation, and iterating quickly based on feedback.'
      },
      automaticScore: 94,
      manualScore: 90,
      overallScore: 92,
      bucket: 'yes',
      stage: 'final',
      comments: [
        {
          id: '5',
          userId: '2',
          userName: 'Mike Thompson',
          content: 'Outstanding product sense and analytical skills. Great examples of driving growth through experimentation. Strong recommendation for final interview with leadership team.',
          createdAt: new Date('2024-01-23')
        }
      ],
      appliedAt: new Date('2024-01-21'),
      lastUpdated: new Date('2024-01-23')
    },
    {
      id: '12',
      jobId: '2',
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '+1 (555) 345-6789',
      resumeUrl: '#',
      coverLetter: 'As a product manager with experience in B2B SaaS platforms, I am interested in bringing my skills to your product team. I have a proven track record of working with engineering teams to deliver complex features on time.',
      customAnswers: {
        'Why do you want to work here?': 'The scale and complexity of your product challenges excite me. I want to work on products that have real impact on businesses and users.',
        'Describe your product management philosophy': 'I focus on understanding the problem deeply before jumping to solutions. I believe in rapid prototyping and getting user feedback early and often.'
      },
      automaticScore: 78,
      manualScore: 82,
      overallScore: 80,
      bucket: 'maybe',
      stage: 'applied',
      comments: [],
      appliedAt: new Date('2024-01-25'),
      lastUpdated: new Date('2024-01-25')
    },
    {
      id: '13',
      jobId: '2',
      name: 'Amanda Foster',
      email: 'amanda.foster@email.com',
      phone: '+1 (555) 234-5678',
      resumeUrl: '#',
      coverLetter: 'I am excited to apply for the Product Manager position. With 5 years of experience in product management at tech companies, I have led cross-functional teams to deliver successful products.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s focus on user experience and data-driven decision making aligns with my approach to product management.',
        'Describe your product management philosophy': 'I believe in putting users first and using data to validate our assumptions. Collaboration and clear communication are key to successful product development.'
      },
      automaticScore: 88,
      manualScore: 86,
      overallScore: 87,
      bucket: 'yes',
      stage: 'interview',
      comments: [],
      appliedAt: new Date('2024-01-26'),
      lastUpdated: new Date('2024-01-28')
    },
    {
      id: '14',
      jobId: '2',
      name: 'Kevin Martinez',
      email: 'kevin.martinez@email.com',
      phone: '+1 (555) 567-8901',
      resumeUrl: '#',
      coverLetter: 'I am interested in the Product Manager role. I have 2 years of experience as a business analyst and am looking to transition into product management.',
      customAnswers: {
        'Why do you want to work here?': 'I want to work for a company that values innovation and user-centric design.',
        'Describe your product management philosophy': 'I believe in understanding user needs and working closely with development teams to build great products.'
      },
      automaticScore: 65,
      manualScore: 60,
      overallScore: 63,
      bucket: 'no',
      stage: 'applied',
      comments: [],
      appliedAt: new Date('2024-01-29'),
      lastUpdated: new Date('2024-01-29')
    },
    {
      id: '15',
      jobId: '2',
      name: 'Rachel Green',
      email: 'rachel.green@email.com',
      phone: '+1 (555) 678-9012',
      resumeUrl: '#',
      coverLetter: 'With 6 years of product management experience, I have successfully launched multiple B2B and B2C products. I am passionate about using data and user research to drive product decisions.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s commitment to building products that solve real problems resonates with me. I want to contribute to your mission.',
        'Describe your product management philosophy': 'I believe in a user-centric approach backed by solid data. Regular user research and A/B testing are essential for building successful products.'
      },
      automaticScore: 90,
      manualScore: 88,
      overallScore: 89,
      bucket: 'yes',
      stage: 'screening',
      comments: [],
      appliedAt: new Date('2024-01-30'),
      lastUpdated: new Date('2024-01-30')
    },
    {
      id: '16',
      jobId: '2',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@email.com',
      phone: '+1 (555) 789-0123',
      resumeUrl: '#',
      coverLetter: 'I am applying for the Product Manager position. I have 3 years of experience in product management and have worked on mobile and web applications.',
      customAnswers: {
        'Why do you want to work here?': 'I am excited about the opportunity to work on innovative products that impact users\' lives.',
        'Describe your product management philosophy': 'I focus on understanding user pain points and working with teams to build solutions that address those needs.'
      },
      automaticScore: 76,
      manualScore: 78,
      overallScore: 77,
      bucket: 'maybe',
      stage: 'screening',
      comments: [],
      appliedAt: new Date('2024-01-28'),
      lastUpdated: new Date('2024-01-29')
    },
    {
      id: '17',
      jobId: '2',
      name: 'Nicole Brown',
      email: 'nicole.brown@email.com',
      phone: '+1 (555) 890-1234',
      resumeUrl: '#',
      coverLetter: 'I am a seasoned product manager with 7 years of experience leading product teams at fast-growing startups. I have a track record of launching successful products and driving user growth.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s vision and product strategy align perfectly with my experience and career goals.',
        'Describe your product management philosophy': 'I believe in building products that users love by combining deep user insights with strong execution and continuous iteration.'
      },
      automaticScore: 92,
      manualScore: 90,
      overallScore: 91,
      bucket: 'yes',
      stage: 'hired',
      comments: [
        {
          id: '6',
          userId: '1',
          userName: 'Sarah Chen',
          content: 'Excellent candidate with strong product leadership experience. Offer extended and accepted.',
          createdAt: new Date('2024-01-31')
        }
      ],
      appliedAt: new Date('2024-01-27'),
      lastUpdated: new Date('2024-01-31')
    },
    {
      id: '18',
      jobId: '2',
      name: 'Mark Johnson',
      email: 'mark.johnson@email.com',
      phone: '+1 (555) 901-2345',
      resumeUrl: '#',
      coverLetter: 'I am interested in transitioning from marketing to product management. I have 4 years of marketing experience and understand user acquisition and retention.',
      customAnswers: {
        'Why do you want to work here?': 'I want to work for a company where I can apply my marketing knowledge to product development.',
        'Describe your product management philosophy': 'I believe in understanding the market and user needs to build products that people want to use.'
      },
      automaticScore: 58,
      manualScore: 55,
      overallScore: 57,
      bucket: 'no',
      stage: 'rejected',
      comments: [],
      appliedAt: new Date('2024-01-24'),
      lastUpdated: new Date('2024-01-25')
    },
    {
      id: '19',
      jobId: '2',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@email.com',
      phone: '+1 (555) 012-3456',
      resumeUrl: '#',
      coverLetter: 'With 4 years of product management experience in the SaaS industry, I have successfully managed product roadmaps and worked closely with engineering teams to deliver features on time.',
      customAnswers: {
        'Why do you want to work here?': 'Your company\'s focus on building scalable SaaS solutions aligns with my experience and interests.',
        'Describe your product management philosophy': 'I believe in agile product development with regular feedback loops and data-driven decision making.'
      },
      automaticScore: 84,
      manualScore: 82,
      overallScore: 83,
      bucket: 'maybe',
      stage: 'interview',
      comments: [],
      appliedAt: new Date('2024-01-31'),
      lastUpdated: new Date('2024-02-01')
    },
    {
      id: '20',
      jobId: '2',
      name: 'Christopher Lee',
      email: 'christopher.lee@email.com',
      phone: '+1 (555) 123-4567',
      resumeUrl: '#',
      coverLetter: 'I am applying for the Product Manager position. I have 1 year of experience as a product analyst and am eager to take on more responsibility in product management.',
      customAnswers: {
        'Why do you want to work here?': 'I want to grow my career in product management at a company that values data-driven decision making.',
        'Describe your product management philosophy': 'I believe in using data and user feedback to guide product decisions and prioritize features.'
      },
      automaticScore: 62,
      manualScore: 58,
      overallScore: 60,
      bucket: 'pending',
      stage: 'applied',
      comments: [],
      appliedAt: new Date('2024-02-01'),
      lastUpdated: new Date('2024-02-01')
    }
  ]
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload]
      };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id 
            ? { ...job, ...action.payload.updates }
            : job
        )
      };
    case 'ADD_APPLICANT':
      return {
        ...state,
        applicants: [...state.applicants, action.payload],
        jobs: state.jobs.map(job =>
          job.id === action.payload.jobId
            ? { ...job, applicantCount: job.applicantCount + 1 }
            : job
        )
      };
    case 'UPDATE_APPLICANT':
      return {
        ...state,
        applicants: state.applicants.map(applicant =>
          applicant.id === action.payload.id
            ? { ...applicant, ...action.payload.updates, lastUpdated: new Date() }
            : applicant
        )
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        applicants: state.applicants.map(applicant =>
          applicant.id === action.payload.applicantId
            ? { 
                ...applicant, 
                comments: [...applicant.comments, action.payload.comment],
                lastUpdated: new Date()
              }
            : applicant
        )
      };
    case 'BULK_UPDATE_APPLICANTS':
      return {
        ...state,
        applicants: state.applicants.map(applicant =>
          action.payload.ids.includes(applicant.id)
            ? { ...applicant, ...action.payload.updates, lastUpdated: new Date() }
            : applicant
        )
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};