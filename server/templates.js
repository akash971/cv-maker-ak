// Pre-configured CV templates
const bangladeshiClassicCV = {
  id: "bd_classic_preset",
  title: "Md. Emran Hossen Biplob - Bangladeshi CV",
  styleMode: "bangladeshi",
  design: {
    fontFamily: "Calibri",
    fontSize: "medium", // small, medium, large
    lineSpacing: "normal", // compact, normal, relaxed
    accentColor: "#4a4a4a",
    headingStyle: "shaded-bar", // shaded-bar, bordered, underline, minimal
    headerAlignment: "center", // left, center, right
    showHeaderTitle: true,
    headerTitle: "CURRICULUM VITAE",
    showHeaderSubtitle: true,
    headerSubtitle: "of",
    contactStyle: "icons-inline", // icons-inline, icons-stacked, classic-labels
    showContactIcons: true,
    photo: {
      show: false,
      url: "",
      shape: "passport",
      position: "top-right"
    },
    declarationText: "I hereby declared to the best of my knowledge and believe that this CV correctly described my qualification, experiences and me. I realize that any willful misstatement described here in may result me in disqualification or dismissal, if engaged.",
    signatureText: "Emran Hossen",
    showSignatureLine: true,
    showDateLine: true,
    dateText: "Date: ...................."
  },
  personal: {
    fullName: "MD. EMRAN HOSSEN BIPLOB",
    jobTitle: "Diploma Engineer (Power Technology)",
    mobile: "01781020390",
    whatsapp: "",
    email: "emranhossen2412@gmail.com",
    address: "Vill: Chandrapur Post: Chandrapur, Upazila: Kaligonj Zilla: Lalmonirhat",
    linkedin: "",
    github: "",
    website: ""
  },
  sections: [
    {
      id: "sec_objective",
      type: "text",
      title: "CAREER OBJECTIVE:",
      enabled: true,
      content: "To enter in a well-reputed organization in a suitable in a positive having the intention to work with honesty, sincerity for long term, grow and eventually take greater responsibilities and to face the challenge of the time and to gain experience & skill for successfully career. Have a desire to be a good researcher academician."
    },
    {
      id: "sec_education",
      type: "education_list",
      title: "EDUCATIONAL QUALIFICATION:",
      enabled: true,
      items: [
        {
          id: "edu_1",
          examName: "Diploma-In-Engineering",
          department: "Power Technology",
          session: "2014-2015",
          yearOfPassing: "Appear",
          institution: "Rangpur Polytechnic Institute, Rangpur.",
          board: "Bangladesh Technical Education Board (BTEB), Dhaka.",
          gpa: ""
        },
        {
          id: "edu_2",
          examName: "Secondary School Certificate.",
          department: "Dress Making",
          session: "",
          yearOfPassing: "2013",
          institution: "Nawdabash SSC Vocational",
          board: "Technical",
          gpa: "5.00(Out of 5.00)"
        }
      ]
    },
    {
      id: "sec_strengths",
      type: "bullet_list",
      title: "KEY STRENGTHS:",
      enabled: true,
      items: [
        "Sincere, reliable, hardworking, and passionate regarding responsibilities.",
        "Ability to work independently under pressure and complete project within tight schedule.",
        "Excellent communicative and interpersonal skill.",
        "Ability to work under fully computerized environment."
      ]
    },
    {
      id: "sec_interests",
      type: "bullet_list",
      title: "INTERESTS:",
      enabled: true,
      items: [
        "Developing personal skills in areas like communication, designing new ideas etc.",
        "Interest in Computer, Reading, Traveling, Gaming, Internet browse etc."
      ]
    },
    {
      id: "sec_computer",
      type: "bullet_list",
      title: "COMPUTER KNOWLEDGE:",
      enabled: true,
      items: [
        "Microsoft Office",
        "E-mailing & Internet Browsing",
        "Operating System: Windows XP, Windows7, Windows8, Windows 10."
      ]
    },
    {
      id: "sec_languages",
      type: "table",
      title: "LANGUAGE PROFICIENCY :",
      enabled: true,
      headers: ["Name", "Reading", "Writing", "Speaking"],
      rows: [
        ["1. Bengali", "Good", "Good", "Good"],
        ["2. English", "Good", "Good", "Good"]
      ]
    },
    {
      id: "sec_training",
      type: "bullet_list",
      title: "TRAINING SKILL:",
      enabled: true,
      items: [
        "Electrical House Rewiring, BTEB (6 Month)",
        "Industrial Attachment Training, BRTC Gazipur (3 Month)",
        "Driving & Basic Mechanic, SEIP Project BRTC Gazipur (4 Month)"
      ]
    },
    {
      id: "sec_experience",
      type: "bullet_list",
      title: "EXPERIENCE:",
      enabled: true,
      items: [
        "Solar & Electrical System.",
        "Generator",
        "Engine",
        "Boiler"
      ]
    },
    {
      id: "sec_personal_info",
      type: "personal_info_grid",
      title: "PERSONAL INFORMATION:",
      enabled: true,
      fields: [
        { label: "Name", value: "Md. Emran Hossen Biplob" },
        { label: "Father's Name", value: "Md. Hamidul Haque" },
        { label: "Mother's Name", value: "Mst. Lutfa Begum" },
        { label: "Permanent Address", value: "Vill: Chandrapur Post: Chandrapur\nUpazila: Kaligonj Zilla: Lalmonirhat" },
        { label: "Date of Birth", value: "10th Nov 1997" },
        { label: "Place of Birth", value: "Chandrapur" },
        { label: "Nationality", value: "Bangladeshi (By birth)" },
        { label: "National Id No", value: "19975213929000182" },
        { label: "Sex", value: "Male" },
        { label: "Blood Group", value: "AB+" },
        { label: "Marital status", value: "Unmarried" },
        { label: "Height", value: "5'9\"" },
        { label: "Weight", value: "65kg." }
      ]
    },
    {
      id: "sec_reference",
      type: "reference_boxes",
      title: "REFERENCE:",
      enabled: true,
      items: [
        {
          number: "1.",
          name: "Engr. Rahul Amin",
          designation: "Chief Instructor (Power Technology)",
          institution: "Rangpur Polytechnic Institute, Rangpur.",
          contact: "Mobile No: 01703452142",
          email: ""
        },
        {
          number: "2.",
          name: "Available upon request",
          designation: "",
          institution: "",
          contact: "",
          email: ""
        }
      ]
    },
    {
      id: "sec_declaration",
      type: "declaration",
      title: "DECLARATION:",
      enabled: true,
      text: "I hereby declared to the best of my knowledge and believe that this CV correctly described my qualification, experiences and me. I realize that any willful misstatement described here in may result me in disqualification or dismissal, if engaged.",
      signName: "Emran Hossen",
      dateLabel: "Date: ...................."
    }
  ]
};

const internationalModernCV = {
  id: "intl_modern_preset",
  title: "Alex Morgan - International Resume",
  styleMode: "international",
  design: {
    fontFamily: "Inter",
    fontSize: "medium",
    lineSpacing: "normal",
    accentColor: "#2563eb",
    headingStyle: "modern-left-border",
    headerTitle: "CURRICULUM VITAE",
    headerSubtitle: "",
    photo: {
      show: true,
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      shape: "circle",
      position: "top-right"
    },
    declarationText: "",
    signatureText: "",
    showSignatureLine: false,
    showDateLine: false,
    dateText: ""
  },
  personal: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Full Stack Software Engineer",
    mobile: "+1 (555) 234-5678",
    email: "alex.morgan@email.com",
    address: "New York, NY, USA",
    linkedin: "linkedin.com/in/alexmorgan-dev",
    github: "github.com/alexmorgan",
    website: "alexmorgan.dev"
  },
  sections: [
    {
      id: "sec_summary",
      type: "text",
      title: "PROFESSIONAL SUMMARY",
      enabled: true,
      content: "Results-driven Senior Software Engineer with 6+ years of expertise architecting high-scale web platforms, distributed microservices, and interactive UI systems. Passionate about performant user experiences, clean maintainable code, and mentoring junior engineers."
    },
    {
      id: "sec_experience",
      type: "experience_cards",
      title: "WORK EXPERIENCE",
      enabled: true,
      items: [
        {
          id: "exp_1",
          role: "Lead Full Stack Engineer",
          company: "Horizon Cloud Technologies",
          location: "New York, NY",
          period: "2022 - Present",
          bullets: [
            "Spearheaded redesign of core SaaS workflow, boosting customer engagement by 38% and reducing page load times by 45%.",
            "Orchestrated migration to modern React/Node microservices serving 1.2M+ monthly active users.",
            "Mentored team of 7 engineers, established automated CI/CD pipelines, and enforced code quality standards."
          ]
        },
        {
          id: "exp_2",
          role: "Software Developer",
          company: "Nexus Digital Systems",
          location: "Boston, MA",
          period: "2019 - 2022",
          bullets: [
            "Engineered real-time data visualization dashboard using React, TypeScript, and WebSocket APIs.",
            "Developed REST and GraphQL backend services with Node.js and PostgreSQL with 99.98% uptime.",
            "Collaborated cross-functionally with product managers and UX designers to roll out 12 major features."
          ]
        }
      ]
    },
    {
      id: "sec_skills",
      type: "skill_badges",
      title: "TECHNICAL & PROFESSIONAL SKILLS",
      enabled: true,
      categories: [
        {
          name: "Languages & Frameworks",
          skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "Python", "Tailwind CSS", "HTML5/CSS3"]
        },
        {
          name: "Databases & Cloud",
          skills: ["PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Git/GitHub", "REST APIs", "GraphQL"]
        },
        {
          name: "Core Competencies",
          skills: ["System Architecture", "Performance Optimization", "Agile/Scrum", "Team Mentorship", "UI/UX Prototyping"]
        }
      ]
    },
    {
      id: "sec_education",
      type: "education_cards",
      title: "EDUCATION",
      enabled: true,
      items: [
        {
          id: "edu_1",
          degree: "Bachelor of Science in Computer Science",
          institution: "State University of New York",
          location: "New York, USA",
          period: "2015 - 2019",
          gpa: "GPA: 3.85 / 4.0 (Dean's Honor List)"
        }
      ]
    },
    {
      id: "sec_projects",
      type: "experience_cards",
      title: "FEATURED PROJECTS",
      enabled: true,
      items: [
        {
          id: "proj_1",
          role: "CloudResume - Open Source Builder",
          company: "Personal Project",
          location: "GitHub",
          period: "2024",
          bullets: [
            "Created an accessible resume and CV builder with dynamic templates and client-side vector PDF generation.",
            "Achieved 2,500+ GitHub stars and featured on Hacker News frontpage."
          ]
        }
      ]
    },
    {
      id: "sec_certifications",
      type: "bullet_list",
      title: "CERTIFICATIONS",
      enabled: true,
      items: [
        "AWS Certified Solutions Architect – Associate (2023)",
        "Meta Certified Professional Front-End Developer (2022)"
      ]
    },
    {
      id: "sec_languages",
      type: "bullet_list",
      title: "LANGUAGES",
      enabled: true,
      items: [
        "English (Native / Bilingual Proficiency)",
        "Spanish (Professional Working Proficiency)"
      ]
    }
  ]
};

module.exports = {
  bangladeshiClassicCV,
  internationalModernCV
};
