const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.analytics.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.website.deleteMany();
  await prisma.business.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const visitorPassword = await bcrypt.hash('visitor123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@webhub.com',
      phone: '+91 98765 43210',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const visitor = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'visitor@gmail.com',
      phone: '+91 98765 00001',
      password: visitorPassword,
      role: 'VISITOR',
      status: 'ACTIVE',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Rajesh Patil',
      email: 'rajesh@techsolutions.com',
      phone: '+91 98450 12345',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
      status: 'ACTIVE',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Ananya Deshmukh',
      email: 'ananya@mysurufood.com',
      phone: '+91 98451 23456',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
      status: 'ACTIVE',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Priya Kulkarni',
      email: 'priya@karnatakafashion.com',
      phone: '+91 98452 34567',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
      status: 'ACTIVE',
    },
  });

  const owner4 = await prisma.user.create({
    data: {
      name: 'Vikram Hegde',
      email: 'vikram@heritagetravels.com',
      phone: '+91 98453 45678',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
      status: 'ACTIVE',
    },
  });

  const owner5 = await prisma.user.create({
    data: {
      name: 'Kavita Shenoy',
      email: 'kavita@urbanglow.com',
      phone: '+91 98454 56789',
      password: ownerPassword,
      role: 'BUSINESS_OWNER',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users seeded');

  // 2. Seed 15 Categories
  const categoriesData = [
    { name: 'Technology', slug: 'technology', icon: 'Cpu', description: 'Software firms, IT services, and tech consulting companies.' },
    { name: 'Restaurants & Cafes', slug: 'restaurants', icon: 'UtensilsCrossed', description: 'Fine dining, cafes, bakeries, and authentic local eateries.' },
    { name: 'Fashion & Apparel', slug: 'fashion', icon: 'Shirt', description: 'Designer boutiques, ethnic wear, and modern clothing retailers.' },
    { name: 'Travel & Tourism', slug: 'travel', icon: 'Compass', description: 'Tour operators, holiday packages, and travel guides.' },
    { name: 'Beauty & Salon', slug: 'beauty-salon', icon: 'Sparkles', description: 'Hair stylists, beauty spas, nail art, and skincare clinics.' },
    { name: 'Healthcare & Wellness', slug: 'healthcare', icon: 'Activity', description: 'Clinics, pharmacies, diagnostic centers, and wellness therapists.' },
    { name: 'Education & Coaching', slug: 'education', icon: 'GraduationCap', description: 'Academies, tutoring centers, language schools, and training institutes.' },
    { name: 'Hotels & Resorts', slug: 'hotels', icon: 'Hotel', description: 'Luxury stays, homestays, heritage resorts, and business hotels.' },
    { name: 'Retail & Supermarkets', slug: 'retail', icon: 'ShoppingBag', description: 'Grocery markets, electronics shops, and department stores.' },
    { name: 'Real Estate & Properties', slug: 'real-estate', icon: 'Home', description: 'Property developers, realtors, rental spaces, and lands.' },
    { name: 'Fitness & Gyms', slug: 'fitness', icon: 'Dumbbell', description: 'Gyms, crossfit boxes, yoga centers, and martial arts studios.' },
    { name: 'Automotive & Repairs', slug: 'automotive', icon: 'Car', description: 'Vehicle servicing, dealerships, spare parts, and bike rentals.' },
    { name: 'Finance & Legal', slug: 'finance', icon: 'TrendingUp', description: 'Chartered accountants, tax consultants, and financial advisors.' },
    { name: 'Professional Services', slug: 'professional-services', icon: 'Briefcase', description: 'Architects, interior designers, photographers, and consultants.' },
    { name: 'Home & Decor', slug: 'home-decor', icon: 'Lamp', description: 'Furniture stores, handicrafts, lighting, and home furnishings.' },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.create({
      data: cat,
    });
    createdCategories[cat.slug] = c;
  }
  console.log('✅ 15 Categories seeded');

  // Helper template generators
  const restaurantTemplate = {
    theme: {
      primaryColor: '#e11d48',
      accentColor: '#fbbf24',
      backgroundColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
    },
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          badge: 'ROYAL HERITAGE RECIPES',
          title: 'Mysuru Food House',
          subtitle: 'Authentic South Indian & Coastal delicacies crafted with time-honored spice blends and pure culinary passion.',
          primaryButtonText: 'Explore Menu',
          primaryButtonLink: '#menu',
          secondaryButtonText: 'Reserve Table',
          secondaryButtonLink: '#contact',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        },
        style: {
          paddingY: 'py-24',
          textAlign: 'text-center',
          bgType: 'dark',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        content: {
          heading: 'Our Culinary Tradition',
          story: 'Founded in 2012, Mysuru Food House brings the legendary flavors of Mysore palace kitchens and coastal Karnataka to your table. Every dish is cooked using fresh stone-ground spices and organic ingredients.',
          stats: [
            { label: 'Signature Dishes', value: '45+' },
            { label: 'Happy Diners', value: '50,000+' },
            { label: 'Years of Tradition', value: '12' },
          ],
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        },
        style: {
          paddingY: 'py-16',
          bgType: 'light',
        },
      },
      {
        id: 'menu-1',
        type: 'products',
        content: {
          heading: 'Chef Specialties & Menu Highlights',
          subtitle: 'Hand-picked delicacies prepared fresh daily for food connoisseurs.',
          items: [
            {
              name: 'Mysore Masala Dosa',
              price: '₹140',
              description: 'Crisp golden crepe smeared with red chili garlic chutney & spiced potato mash.',
              imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80',
              tag: 'Bestseller',
            },
            {
              name: 'Royal Mysore Pak',
              price: '₹220',
              description: 'Melt-in-mouth traditional sweet made with pure desi ghee and fragrant cardamom.',
              imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
              tag: 'Traditional',
            },
            {
              name: 'Neer Dosa with Veg Kurma',
              price: '₹160',
              description: 'Feather-light rice crepes served with rich coconut and cashew vegetable gravy.',
              imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=500&q=80',
              tag: 'Chef Choice',
            },
          ],
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        content: {
          heading: 'What Food Lovers Say',
          items: [
            {
              quote: 'The most authentic Mysore Pak and filter coffee I have had outside of Mysore palace grounds!',
              author: 'Rohit K.',
              role: 'Food Blogger',
              rating: 5,
            },
            {
              quote: 'The ambience is peaceful, and the hygiene and hospitality are truly 5-star.',
              author: 'Dr. Sunita V.',
              role: 'Local Resident',
              rating: 5,
            },
          ],
        },
        style: {
          paddingY: 'py-16',
          bgType: 'gray',
        },
      },
      {
        id: 'contact-1',
        type: 'contact',
        content: {
          heading: 'Visit Us & Reserve Your Table',
          subtitle: 'Open 7 days a week from 7:30 AM to 10:30 PM.',
          phone: '+91 98451 23456',
          email: 'contact@mysurufood.com',
          address: '42, Temple Road, Vontikoppal, Mysuru, Karnataka 570002',
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        content: {
          brandName: 'Mysuru Food House',
          tagline: 'Serving authentic royal Karnataka flavors with warmth and heritage.',
          copyright: '© 2026 Mysuru Food House. Powered by WebHub.',
        },
        style: {
          paddingY: 'py-10',
          bgType: 'dark',
        },
      },
    ],
  };

  const corporateTemplate = {
    theme: {
      primaryColor: '#2563eb',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-corp-1',
        type: 'hero',
        content: {
          badge: 'ENTERPRISE IT & CLOUD ENGINEERING',
          title: 'Belagavi Tech Solutions',
          subtitle: 'Empowering global enterprises with bespoke cloud architecture, mobile apps, and scalable digital transformation.',
          primaryButtonText: 'Our Services',
          primaryButtonLink: '#services',
          secondaryButtonText: 'Schedule Consultation',
          secondaryButtonLink: '#contact',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        },
        style: {
          paddingY: 'py-24',
          textAlign: 'text-left',
          bgType: 'gradient',
        },
      },
      {
        id: 'services-corp-1',
        type: 'features',
        content: {
          heading: 'High-Impact Digital Solutions',
          subtitle: 'End-to-end technology services tailored to scale your enterprise.',
          items: [
            {
              title: 'Full-Stack Web & Cloud',
              description: 'Next.js, Node.js, and AWS microservices built for speed, uptime, and high concurrency.',
              icon: 'Globe',
            },
            {
              title: 'Custom Mobile Apps',
              description: 'Native iOS & Android applications engineered for fluid user journeys and high retention.',
              icon: 'Smartphone',
            },
            {
              title: 'AI & Data Integration',
              description: 'Intelligent automation, predictive reporting, and business process optimizations.',
              icon: 'Cpu',
            },
          ],
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'about-corp-1',
        type: 'about',
        content: {
          heading: 'Engineered for Performance & Trust',
          story: 'Based in the tier-2 tech hub of Belagavi, our team of 40+ senior developers combines world-class technical execution with accessible pricing and agile turnaround times.',
          stats: [
            { label: 'Completed Projects', value: '120+' },
            { label: 'Client Retention', value: '98%' },
            { label: 'Global Clients', value: '14 Countries' },
          ],
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        },
        style: {
          paddingY: 'py-16',
          bgType: 'gray',
        },
      },
      {
        id: 'contact-corp-1',
        type: 'contact',
        content: {
          heading: 'Let’s Build Something Remarkable',
          subtitle: 'Drop us a project scope or request a free technical consultation.',
          phone: '+91 98450 12345',
          email: 'hello@techsolutions.com',
          address: 'Tech Park, Khanapur Road, Belagavi, Karnataka 590006',
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'footer-corp-1',
        type: 'footer',
        content: {
          brandName: 'Belagavi Tech Solutions',
          tagline: 'Precision software engineering for modern enterprises.',
          copyright: '© 2026 Belagavi Tech Solutions. All rights reserved.',
        },
        style: {
          paddingY: 'py-10',
          bgType: 'dark',
        },
      },
    ],
  };

  const fashionTemplate = {
    theme: {
      primaryColor: '#7c3aed',
      accentColor: '#f43f5e',
      backgroundColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
    },
    sections: [
      {
        id: 'hero-fash-1',
        type: 'hero',
        content: {
          badge: 'HANDCRAFTED SILKS & MODERN ETHNIC',
          title: 'Karnataka Fashion Hub',
          subtitle: 'Celebrated handloom sarees, bespoke bridal trousseaus, and contemporary festive collections.',
          primaryButtonText: 'Explore Collection',
          primaryButtonLink: '#products',
          secondaryButtonText: 'Book Styling Session',
          secondaryButtonLink: '#contact',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        },
        style: {
          paddingY: 'py-24',
          textAlign: 'text-center',
          bgType: 'gradient',
        },
      },
      {
        id: 'fash-prod-1',
        type: 'products',
        content: {
          heading: 'Curated Festive Collections',
          subtitle: 'Hand-woven masterpieces made with pure zari and certified silk threads.',
          items: [
            {
              name: 'Pure Ilkal Handloom Silk',
              price: '₹8,500',
              description: 'Authentic Ilkal weave with traditional Topetenne pallu and kasuti embroidery accents.',
              imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
              tag: 'Heritage',
            },
            {
              name: 'Mysore Crepe Silk Saree',
              price: '₹14,200',
              description: 'Feather-light pure crepe with hand-twisted pure gold zari borders.',
              imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
              tag: 'Bridal',
            },
            {
              name: 'Contemporary Fusion Kurti',
              price: '₹3,400',
              description: 'Breathable linen with natural indigo dye patterns and handcrafted wooden buttons.',
              imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=80',
              tag: 'New Arrival',
            },
          ],
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'contact-fash-1',
        type: 'contact',
        content: {
          heading: 'Visit Our Flagship Boutique',
          subtitle: 'Personal styling appointments and custom bridal fitting sessions available.',
          phone: '+91 98452 34567',
          email: 'orders@karnatakafashion.com',
          address: '88, Commercial Street, Shivajinagar, Bengaluru, Karnataka 560001',
        },
        style: {
          paddingY: 'py-20',
          bgType: 'gray',
        },
      },
      {
        id: 'footer-fash-1',
        type: 'footer',
        content: {
          brandName: 'Karnataka Fashion Hub',
          tagline: 'Preserving Karnataka handloom legacy through timeless couture.',
          copyright: '© 2026 Karnataka Fashion Hub.',
        },
        style: {
          paddingY: 'py-10',
          bgType: 'dark',
        },
      },
    ],
  };

  const beautyTemplate = {
    theme: {
      primaryColor: '#db2777',
      accentColor: '#fb7185',
      backgroundColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
    },
    sections: [
      {
        id: 'hero-beauty-1',
        type: 'hero',
        content: {
          badge: 'ORGANIC SPA & AESTHETIC STUDIO',
          title: 'Urban Glow Beauty Lounge',
          subtitle: 'Revitalize your skin, hair, and spirit with our luxury botanical therapies and professional bridal transformations.',
          primaryButtonText: 'View Treatments',
          primaryButtonLink: '#services',
          secondaryButtonText: 'Book Appointment',
          secondaryButtonLink: '#contact',
          imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80',
        },
        style: {
          paddingY: 'py-24',
          textAlign: 'text-center',
          bgType: 'gradient',
        },
      },
      {
        id: 'beauty-services-1',
        type: 'features',
        content: {
          heading: 'Signature Treatments',
          subtitle: 'Indulgent, safe, and dermatologically approved wellness packages.',
          items: [
            {
              title: 'Ayurvedic Gold Glow Facial',
              description: 'Restores skin radiance, deeply cleanses pores, and boosts collagen synthesis.',
              icon: 'Sparkles',
            },
            {
              title: 'Keratin & Botanical Hair Spa',
              description: 'Intense moisture therapy with natural argan oil and Moroccan clay.',
              icon: 'Scissors',
            },
            {
              title: 'Luxury Bridal Makeovers',
              description: 'HD and Airbrush makeup tailored for your special day by certified celebrity artists.',
              icon: 'Heart',
            },
          ],
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'contact-beauty-1',
        type: 'contact',
        content: {
          heading: 'Book Your Pamper Session',
          subtitle: 'Prior appointments recommended for weekend bridal slots.',
          phone: '+91 98454 56789',
          email: 'glow@urbanglow.com',
          address: '15, Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
        },
        style: {
          paddingY: 'py-20',
          bgType: 'gray',
        },
      },
      {
        id: 'footer-beauty-1',
        type: 'footer',
        content: {
          brandName: 'Urban Glow Beauty Lounge',
          tagline: 'Natural luxury for your everyday glow.',
          copyright: '© 2026 Urban Glow Beauty Lounge.',
        },
        style: {
          paddingY: 'py-10',
          bgType: 'dark',
        },
      },
    ],
  };

  const travelTemplate = {
    theme: {
      primaryColor: '#059669',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
    },
    sections: [
      {
        id: 'hero-travel-1',
        type: 'hero',
        content: {
          badge: 'CUSTOM EXPEDITIONS & HERITAGE CIRCUITS',
          title: 'Heritage Travels Karnataka',
          subtitle: 'Uncover the majestic ruins of Hampi, lush coffee estates of Coorg, and pristine Gokarna coastlines with verified local guides.',
          primaryButtonText: 'Explore Tour Packages',
          primaryButtonLink: '#packages',
          secondaryButtonText: 'Plan Custom Trip',
          secondaryButtonLink: '#contact',
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        },
        style: {
          paddingY: 'py-24',
          textAlign: 'text-center',
          bgType: 'dark',
        },
      },
      {
        id: 'travel-packages-1',
        type: 'products',
        content: {
          heading: 'Trending Curated Circuits',
          subtitle: 'All-inclusive trips with verified homestays, private transport, and local storytelling guides.',
          items: [
            {
              name: 'Hampi & Badami UNESCO Trail',
              price: '₹12,499 / person',
              description: '3 Days / 2 Nights exploring Vijayanagara empire architecture, boulder sunsets, and cave temples.',
              imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e421d013?auto=format&fit=crop&w=500&q=80',
              tag: 'Top Rated',
            },
            {
              name: 'Coorg Coffee & Waterfalls Escapade',
              price: '₹9,999 / person',
              description: 'Weekend retreat in mist-covered plantations with private coffee tasting and river rafting.',
              imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=500&q=80',
              tag: 'Nature Escape',
            },
            {
              name: 'Gokarna & Karwar Coastal Odyssey',
              price: '₹14,500 / person',
              description: 'Beach treks, dolphin spotting boat rides, and fresh seafood beachside dining.',
              imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80',
              tag: 'Adventure',
            },
          ],
        },
        style: {
          paddingY: 'py-20',
          bgType: 'light',
        },
      },
      {
        id: 'contact-travel-1',
        type: 'contact',
        content: {
          heading: 'Book Your Next Adventure',
          subtitle: 'Call or message our travel consultants 24x7 for group discounts.',
          phone: '+91 98453 45678',
          email: 'trips@heritagetravels.com',
          address: '56, Court Road, Udupi, Karnataka 576101',
        },
        style: {
          paddingY: 'py-20',
          bgType: 'gray',
        },
      },
      {
        id: 'footer-travel-1',
        type: 'footer',
        content: {
          brandName: 'Heritage Travels',
          tagline: 'Connecting travelers with authentic South Indian wonders.',
          copyright: '© 2026 Heritage Travels. All rights reserved.',
        },
        style: {
          paddingY: 'py-10',
          bgType: 'dark',
        },
      },
    ],
  };

  // 3. Seed 10 Businesses + Websites
  const businessesData = [
    {
      owner: owner2,
      categorySlug: 'restaurants',
      businessName: 'Mysuru Food House',
      slug: 'mysuru-food-house',
      description: 'Iconic authentic South Indian and coastal dining destination renowned for royal recipes and pure ghee delicacies.',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98451 23456',
      email: 'contact@mysurufood.com',
      website: 'http://localhost:5173/site/mysuru-food-house',
      address: '42, Temple Road, Vontikoppal',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570002',
      openingHours: 'Mon - Sun: 7:30 AM - 10:30 PM',
      socialLinks: JSON.stringify({ instagram: '@mysurufoodhouse', facebook: 'mysurufood' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'restaurant',
      templateData: restaurantTemplate,
    },
    {
      owner: owner1,
      categorySlug: 'technology',
      businessName: 'Belagavi Tech Solutions',
      slug: 'belagavi-tech-solutions',
      description: 'Pioneering software engineering agency crafting full-stack cloud applications, mobile products, and AI integration.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98450 12345',
      email: 'hello@techsolutions.com',
      website: 'http://localhost:5173/site/belagavi-tech-solutions',
      address: 'Tech Park, Khanapur Road',
      city: 'Belagavi',
      state: 'Karnataka',
      pincode: '590006',
      openingHours: 'Mon - Fri: 9:00 AM - 6:30 PM',
      socialLinks: JSON.stringify({ linkedin: 'belagavitech', twitter: '@belagavitech' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'corporate',
      templateData: corporateTemplate,
    },
    {
      owner: owner3,
      categorySlug: 'fashion',
      businessName: 'Karnataka Fashion Hub',
      slug: 'karnataka-fashion-hub',
      description: 'Exclusive boutique for handcrafted pure silk sarees, royal Mysore weaves, and contemporary ethnic designer wear.',
      logo: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98452 34567',
      email: 'orders@karnatakafashion.com',
      website: 'http://localhost:5173/site/karnataka-fashion-hub',
      address: '88, Commercial Street, Shivajinagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      openingHours: 'Mon - Sat: 10:30 AM - 9:00 PM',
      socialLinks: JSON.stringify({ instagram: '@karnatakafashionhub' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'fashion',
      templateData: fashionTemplate,
    },
    {
      owner: owner4,
      categorySlug: 'travel',
      businessName: 'Heritage Travels',
      slug: 'heritage-travels',
      description: 'Curated heritage expeditions, beach retreats, and eco-tours across Hampi, Coorg, Gokarna, and Western Ghats.',
      logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600100397608-f010e421d013?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98453 45678',
      email: 'trips@heritagetravels.com',
      website: 'http://localhost:5173/site/heritage-travels',
      address: '56, Court Road',
      city: 'Udupi',
      state: 'Karnataka',
      pincode: '576101',
      openingHours: 'Mon - Sun: 8:00 AM - 8:00 PM',
      socialLinks: JSON.stringify({ instagram: '@heritagetravelskarnataka' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'travel',
      templateData: travelTemplate,
    },
    {
      owner: owner5,
      categorySlug: 'beauty-salon',
      businessName: 'Urban Glow Beauty Lounge',
      slug: 'urban-glow-beauty-lounge',
      description: 'Luxury botanical spa, bridal makeover studio, and skincare sanctuary delivering organic transformations.',
      logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98454 56789',
      email: 'glow@urbanglow.com',
      website: 'http://localhost:5173/site/urban-glow-beauty-lounge',
      address: '15, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      openingHours: 'Tue - Sun: 10:00 AM - 8:30 PM',
      socialLinks: JSON.stringify({ instagram: '@urbanglow_lounge' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'beauty',
      templateData: beautyTemplate,
    },
    {
      owner: owner1,
      categorySlug: 'technology',
      businessName: 'Bengaluru Digital Works',
      slug: 'bengaluru-digital-works',
      description: 'Creative digital agency specialized in brand strategy, UI/UX design systems, and modern SaaS product development.',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98455 67890',
      email: 'hello@digitalworks.in',
      website: 'http://localhost:5173/site/bengaluru-digital-works',
      address: '77, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      openingHours: 'Mon - Fri: 9:30 AM - 6:30 PM',
      socialLinks: JSON.stringify({ twitter: '@bdw_tech' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'corporate',
      templateData: corporateTemplate,
    },
    {
      owner: owner2,
      categorySlug: 'hotels',
      businessName: 'Coorg Mist Valley Resort',
      slug: 'coorg-mist-valley-resort',
      description: 'Eco-resort nestled amidst 50 acres of sprawling aromatic coffee and cardamom plantations with private cottages.',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98456 78901',
      email: 'stay@coorgmistvalley.com',
      website: 'http://localhost:5173/site/coorg-mist-valley-resort',
      address: 'Madikeri - Virajpet Road',
      city: 'Madikeri',
      state: 'Karnataka',
      pincode: '571201',
      openingHours: '24/7 Front Desk',
      socialLinks: JSON.stringify({ instagram: '@coorgmistresort' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'travel',
      templateData: travelTemplate,
    },
    {
      owner: owner3,
      categorySlug: 'fitness',
      businessName: 'Pulse Elite Fitness & Crossfit',
      slug: 'pulse-elite-fitness',
      description: 'World-class strength equipment, Olympic lifting platforms, certified coaches, and customized nutrition guidance.',
      logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98457 89012',
      email: 'fit@pulsefitness.in',
      website: '',
      address: '33, Tilakwadi Main Road',
      city: 'Belagavi',
      state: 'Karnataka',
      pincode: '590006',
      openingHours: 'Mon - Sat: 5:30 AM - 10:00 PM',
      socialLinks: JSON.stringify({ instagram: '@pulse_belagavi' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'corporate',
      templateData: corporateTemplate,
    },
    {
      owner: owner4,
      categorySlug: 'healthcare',
      businessName: 'Sanjeevani Ayurvedic Wellness',
      slug: 'sanjeevani-ayurvedic-wellness',
      description: 'Panchakarma healing therapies, spine care, and stress relief treatments guided by certified BAMS doctors.',
      logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98458 90123',
      email: 'care@sanjeevaniwell.com',
      website: '',
      address: '22, Sharada Nagar',
      city: 'Hubballi',
      state: 'Karnataka',
      pincode: '580023',
      openingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      socialLinks: JSON.stringify({ facebook: 'sanjeevaniwell' }),
      status: 'PENDING', // One sample pending for admin approval testing!
      approvedAt: null,
      template: 'beauty',
      templateData: beautyTemplate,
    },
    {
      owner: owner5,
      categorySlug: 'retail',
      businessName: 'Malnad Organic Spices & Honey',
      slug: 'malnad-organic-spices',
      description: 'Direct farm-to-door fresh black pepper, wild forest raw honey, cardamom, and cold-pressed coconut oils.',
      logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
      phone: '+91 98459 01234',
      email: 'info@malnadorganic.in',
      website: '',
      address: 'Market Yard, B.H. Road',
      city: 'Shivamogga',
      state: 'Karnataka',
      pincode: '577201',
      openingHours: 'Mon - Sat: 9:00 AM - 8:30 PM',
      socialLinks: JSON.stringify({ instagram: '@malnad_organic' }),
      status: 'APPROVED',
      approvedAt: new Date(),
      template: 'fashion',
      templateData: fashionTemplate,
    },
  ];

  console.log('🌱 Seeding businesses and websites...');
  for (const b of businessesData) {
    const cat = createdCategories[b.categorySlug] || Object.values(createdCategories)[0];
    const createdBusiness = await prisma.business.create({
      data: {
        userId: b.owner.id,
        categoryId: cat.id,
        businessName: b.businessName,
        slug: b.slug,
        description: b.description,
        logo: b.logo,
        coverImage: b.coverImage,
        phone: b.phone,
        email: b.email,
        website: b.website,
        address: b.address,
        city: b.city,
        state: b.state,
        pincode: b.pincode,
        openingHours: b.openingHours,
        socialLinks: b.socialLinks,
        status: b.status,
        approvedAt: b.approvedAt,
      },
    });

    // Create published website if status is approved and templateData exists
    if (b.status === 'APPROVED' && b.templateData) {
      const site = await prisma.website.create({
        data: {
          businessId: createdBusiness.id,
          name: `${b.businessName} Official Website`,
          slug: b.slug,
          template: b.template,
          contentJson: JSON.stringify(b.templateData),
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      // Seed 2 sample enquiries for the business
      await prisma.enquiry.createMany({
        data: [
          {
            businessId: createdBusiness.id,
            name: 'Sunil Kumar',
            email: 'sunil.k@gmail.com',
            phone: '+91 91234 56780',
            message: `Hello, I saw your listing for ${b.businessName} on WebHub. Could you share more information about your current packages and availability?`,
            status: 'NEW',
          },
          {
            businessId: createdBusiness.id,
            name: 'Meera Rao',
            email: 'meera.rao@outlook.com',
            phone: '+91 91234 56781',
            message: `Hi, wanted to check if you take weekend reservations or custom consultations? Thanks!`,
            status: 'READ',
          },
        ],
      });

      // Seed sample analytics (views and clicks across the past 7 days)
      const now = new Date();
      const analyticsRecords = [];
      for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const date = new Date(now);
        date.setDate(date.getDate() - dayOffset);

        // Generate between 15 and 45 views per day
        const viewCount = Math.floor(Math.random() * 30) + 15;
        for (let i = 0; i < viewCount; i++) {
          analyticsRecords.push({
            websiteId: site.id,
            eventType: 'VIEW',
            visitorIpHash: `hash_${Math.floor(Math.random() * 50)}`,
            page: 'home',
            createdAt: date,
          });
        }

        // Generate 2-8 clicks/actions
        const clickCount = Math.floor(Math.random() * 7) + 2;
        for (let i = 0; i < clickCount; i++) {
          analyticsRecords.push({
            websiteId: site.id,
            eventType: 'CLICK',
            visitorIpHash: `hash_${Math.floor(Math.random() * 50)}`,
            page: 'home',
            createdAt: date,
          });
        }
      }

      await prisma.analytics.createMany({
        data: analyticsRecords,
      });
    }
  }

  console.log('✅ 10 Businesses, Websites, Enquiries, and Analytics seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
