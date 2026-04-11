export const siteConfig = {
  name: 'TARAhut AI Labs',
  description: "Punjab's First AI Training Center. Master AI tools through hands-on offline training in Kotkapura and beyond.",
  url: 'https://tarahutailabs.com',
  ogImage: 'https://tarahutailabs.com/og.png',
  links: {
    whatsapp: 'https://wa.me/919200882008',
    instagram: 'https://instagram.com/tarahutailabs',
    linkedin: 'https://linkedin.com/company/tarahutailabs',
    youtube: 'https://youtube.com/@tarahutailabs',
  },
  contact: {
    email: 'hello@tarahutailabs.com',
    phone: '+91-92008-82008',
    address: 'Kotkapura, Punjab, India',
  },
  // Honest facts — verifiable from courses.ts and the Kotkapura center.
  // Removed fake studentsCount / placementRate — TARAhut hasn't launched
  // batches yet, so any "X+ students trained" claim was a fabrication.
  stats: {
    coursesCount: '9',
    toolsCount: '10+',
    startingPrice: '₹2,499',
    location: 'Kotkapura, Punjab',
  },
} as const;
