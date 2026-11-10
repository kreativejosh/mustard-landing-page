// Website copy, verbatim from content/website-copy.md (Mustard Bio comms and marketing website copy).
// Do not reword. Vision copy lives on the About page.

export const HOME = {
  hero: {
    title: ['The intelligence layer for', 'the factories of the future.'],
    sub: 'Reinventing pharmaceutical manufacturing through intelligent systems, automation and real-world production.',
    body: [
      'Mustard Bio is building a new model for pharmaceutical manufacturing, combining advanced production infrastructure with proprietary manufacturing intelligence software.',
      'We are starting with pharmaceuticals in Nigeria, developing the technology and operating systems intended to power smarter factories around the world.',
    ],
    primary: 'Explore Mustard Bio',
    secondary: 'Partner With Us',
  },
  approach: {
    title: 'A new approach to manufacturing',
    body: [
      'Pharmaceutical manufacturing is a complex undertaking that requires significant investment in equipment, quality systems, regulatory compliance and skilled personnel.',
      'The next generation of manufacturers will compete on how intelligently production capacity is operated.',
      'Mustard Bio is building towards that future by bringing manufacturing operations and software development together.',
    ],
  },
  businesses: {
    title: 'One company with two connected businesses.',
    manufacturing: {
      title: 'Pharmaceutical Manufacturing',
      body: [
        'We are developing a pharmaceutical manufacturing operation in Nigeria, initially focused on oral solid dosage products, including tablets and capsules.',
        'Our services include contract manufacturing and white-label production for pharmaceutical companies seeking manufacturing capacity.',
      ],
    },
    intelligence: {
      title: 'Manufacturing Intelligence',
      body: [
        'Maverick OS is our proprietary manufacturing execution software.',
        'Designed around pharmaceutical production workflows, it aims to improve how manufacturing processes are monitored, documented, managed and eventually automated.',
      ],
    },
    together: 'Together, these businesses create an opportunity to develop manufacturing technology within a real production environment.',
  },
  start: {
    title: 'Starting with pharmaceuticals and building for the future.',
    body: [
      'Our first planned manufacturing facility is in Ogun State, Nigeria.',
      'It is the foundation for our pharmaceutical production business and a deployment environment for Maverick OS.',
      'Our longer-term ambition extends beyond a single factory or geography: to develop intelligent manufacturing systems that can be deployed across pharmaceutical production facilities internationally.',
    ],
  },
  build: {
    title: 'Build with us',
    body: 'We are engaging pharmaceutical companies, technical partners, equipment providers and investors interested in the future of manufacturing.',
    audiences: ['Pharmaceutical companies', 'Technical partners', 'Equipment providers', 'Investors'],
    cta: 'Start a Conversation',
  },
};

export const MANUFACTURING = {
  hero: {
    title: ['Pharmaceutical manufacturing built for', 'a new era.'],
    body: [
      'Mustard Bio is developing its first pharmaceutical production facility in Mowe, Ogun State, Nigeria.',
      'The proposed pilot facility occupies approximately 4,000 square feet and is planned around oral solid dosage manufacturing.',
    ],
  },
  facts: [
    { k: 'Location', v: 'Mowe, Ogun State, Nigeria' },
    { k: 'Pilot facility', v: 'Approximately 4,000 square feet' },
    { k: 'Planned around', v: 'Oral solid dosage manufacturing' },
  ],
  blocks: [
    { eyebrow: 'Initial manufacturing focus', title: 'Tablets and capsules', body: ['Our initial production strategy centres on oral solid dosage forms, with potential expansion into semi-solid products such as creams, ointments and gels.'] },
    { title: 'Contract manufacturing', body: ['We intend to provide manufacturing services to pharmaceutical businesses looking to outsource production or establish local manufacturing arrangements.'] },
    { title: 'Quality-led operations', body: ['The facility is being planned with pharmaceutical manufacturing and quality requirements in mind. Commercial production will depend on the necessary facility development, qualification, regulatory approvals and operating systems.'] },
  ],
  evolve: {
    title: 'Designed to evolve',
    body: [
      'Rather than treating production technology as an external addition, we intend to develop our manufacturing operations and software systems together.',
      'The objective is to use operational experience to inform how Maverick OS is built, tested and improved.',
    ],
  },
  cta: 'Discuss a Manufacturing Partnership',
};

export const TECHNOLOGY = {
  hero: {
    title: ['Meet Maverick OS.'],
    sub: 'Manufacturing intelligence, developed for pharmaceutical production.',
    body: ["Maverick OS is Mustard Bio's proprietary manufacturing execution software, designed to support the management and monitoring of pharmaceutical manufacturing workflows."],
  },
  today: {
    title: 'What Maverick OS can demonstrate today',
    body: 'The current software demonstration supports simulated pharmaceutical manufacturing workflows, including batch creation, pre-start checks, electronic sign-offs, process monitoring, electronic batch records and release-test checks.',
    workflows: ['Batch creation', 'Pre-start checks', 'Electronic sign-offs', 'Process monitoring', 'Electronic batch records', 'Release-test checks'],
    note: 'These capabilities have been demonstrated in a simulated environment. Maverick OS is not yet validated or deployed for routine production use.',
  },
  next: {
    title: "What we're building next",
    body: [
      'Our development roadmap focuses on connecting Maverick OS to real manufacturing environments, beginning with read-only machine data integration.',
      'Subsequent development will address production-grade audit trails, electronic records, security, reliability, quality workflows and the validation required for pharmaceutical operations.',
    ],
  },
  going: {
    title: "Where we're going",
    body: [
      'Our longer-term roadmap moves from monitoring and operator decision support toward supervised automation of approved manufacturing processes.',
      'We ultimately intend to make Maverick OS available to other pharmaceutical manufacturers through commercial software arrangements, subject to successful development and validation.',
    ],
  },
  cta: 'Explore Technology Partnerships',
};

export const ABOUT = {
  hero: {
    title: ['Building the technology behind', "tomorrow's factories."],
    body: [
      'Mustard Bio brings pharmaceutical manufacturing development and software engineering together around a shared ambition: making manufacturing more intelligent.',
      'We are starting in Nigeria with an ambition to serve manufacturing markets globally.',
    ],
  },
  vision: {
    title: ['A future where factories operate', 'more intelligently.'],
    body: [
      'We envision a manufacturing industry where software, automation and production infrastructure work together to improve operational performance.',
      'Our ambition is to develop systems that can progressively reduce manual intervention, improve production visibility and enable increasingly autonomous manufacturing.',
      'Pharmaceutical manufacturing is our starting point because of its demanding requirements for quality, traceability, reliability and process control.',
      'Over time, we aim to apply the technologies and operating principles developed through this work to a broader range of manufacturing environments.',
    ],
    destination: 'The destination is intelligent, increasingly autonomous factories. The work begins with building and validating the systems that make them possible.',
  },
  contact: {
    body: 'For manufacturing enquiries, technology partnerships and investment conversations, contact Mustard Bio.',
    topics: ['Manufacturing enquiries', 'Technology partnerships', 'Investment conversations'],
  },
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/manufacturing', label: 'Manufacturing' },
  { href: '/technology', label: 'Technology' },
  { href: '/about', label: 'About' },
];

export const TAGLINE = 'The intelligence layer for the factories of the future.';
