// 5 Website Starter Templates
const templates = [
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    category: 'Food & Dining',
    description: 'Perfect for cafes, bakeries, bars, and fine dining with hero, menu items, chef story, reviews, and reservation contact.',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    data: {
      theme: {
        primaryColor: '#e11d48',
        accentColor: '#fbbf24',
        backgroundColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
      },
      sections: [
        {
          id: 'hero-rest',
          type: 'hero',
          content: {
            badge: 'AUTHENTIC TASTE & AMBIENCE',
            title: 'Savor Every Moment & Spice',
            subtitle: 'Experience exquisite artisanal recipes crafted fresh daily using local ingredients and royal culinary traditions.',
            primaryButtonText: 'Explore Menu',
            primaryButtonLink: '#menu',
            secondaryButtonText: 'Book a Table',
            secondaryButtonLink: '#contact',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-24', textAlign: 'text-center', bgType: 'dark' },
        },
        {
          id: 'about-rest',
          type: 'about',
          content: {
            heading: 'Crafted with Passion & Purity',
            story: 'From our hand-ground spices to our wood-fired oven, every plate is an ode to authentic cooking traditions passed down for generations.',
            stats: [
              { label: 'Signature Dishes', value: '35+' },
              { label: 'Happy Guests', value: '40K+' },
              { label: 'Culinary Awards', value: '8' },
            ],
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'menu-rest',
          type: 'products',
          content: {
            heading: 'Featured Menu Items',
            subtitle: 'Signature culinary creations loved by our food enthusiasts.',
            items: [
              {
                name: 'Crispy Butter Masala Dosa',
                price: '₹140',
                description: 'Golden roasted crepe stuffed with spiced potato mash and roasted garlic chutney.',
                imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80',
                tag: 'Bestseller',
              },
              {
                name: 'Traditional Royal Mysore Pak',
                price: '₹220',
                description: 'Rich melt-in-mouth gram flour fudge prepared in pure village ghee.',
                imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
                tag: 'Specialty',
              },
              {
                name: 'Filter Kaapi & Sweet Kesari',
                price: '₹95',
                description: 'Fresh decoction brewed with hand-roasted chicory blend and aromatic semolina sweet.',
                imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
                tag: 'Classic',
              },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'contact-rest',
          type: 'contact',
          content: {
            heading: 'Reserve Your Table Today',
            subtitle: 'Open daily from 7:30 AM to 10:30 PM. Walk-ins and private parties welcomed.',
            phone: '+91 98451 23456',
            email: 'dine@restaurant.com',
            address: '42, Heritage Boulevard, City Center',
          },
          style: { paddingY: 'py-20', bgType: 'gray' },
        },
        {
          id: 'footer-rest',
          type: 'footer',
          content: {
            brandName: 'Royal Dining Restaurant',
            tagline: 'Serving heartwarming meals made with pure love and heritage.',
            copyright: '© 2026 Royal Dining. Powered by WebHub.',
          },
          style: { paddingY: 'py-10', bgType: 'dark' },
        },
      ],
    },
  },
  {
    id: 'corporate',
    name: 'Business & Corporate',
    category: 'Technology & Enterprise',
    description: 'Modern, high-conversion layout for consulting agencies, software companies, and enterprise service firms.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    data: {
      theme: {
        primaryColor: '#2563eb',
        accentColor: '#10b981',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
      },
      sections: [
        {
          id: 'hero-corp',
          type: 'hero',
          content: {
            badge: 'NEXT-GENERATION ENTERPRISE SOLUTIONS',
            title: 'Driving Innovation & Digital Scalability',
            subtitle: 'We empower ambitious brands with resilient cloud engineering, custom software solutions, and data intelligence.',
            primaryButtonText: 'Discover Capabilities',
            primaryButtonLink: '#services',
            secondaryButtonText: 'Get Consultation',
            secondaryButtonLink: '#contact',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-24', textAlign: 'text-left', bgType: 'gradient' },
        },
        {
          id: 'features-corp',
          type: 'features',
          content: {
            heading: 'Tailored Technical Capabilities',
            subtitle: 'End-to-end consulting and implementation services for modern high-growth businesses.',
            items: [
              {
                title: 'Full-Stack Cloud Architecture',
                description: 'Secure, auto-scaling web platforms built with Node, React, and containerized microservices.',
                icon: 'Globe',
              },
              {
                title: 'Data & Process Automation',
                description: 'Streamline operational workflows and unlock predictive business intelligence.',
                icon: 'Cpu',
              },
              {
                title: 'Enterprise Cyber Security',
                description: 'Robust authentication, compliance protocols, and round-the-clock vulnerability monitoring.',
                icon: 'Shield',
              },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'about-corp',
          type: 'about',
          content: {
            heading: 'Proven Track Record of Excellence',
            story: 'Over a decade of solving complex technical challenges for Fortune 500 corporations and disruptive startups worldwide.',
            stats: [
              { label: 'Delivered Projects', value: '150+' },
              { label: 'Uptime SLA', value: '99.98%' },
              { label: 'NPS Score', value: '88' },
            ],
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          },
          style: { paddingY: 'py-16', bgType: 'gray' },
        },
        {
          id: 'contact-corp',
          type: 'contact',
          content: {
            heading: 'Initiate Your Project Discussion',
            subtitle: 'Schedule a discovery session with our senior solution architects.',
            phone: '+91 98450 12345',
            email: 'contact@enterprise.com',
            address: 'Tower A, Global Tech Park, Bengaluru, Karnataka',
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'footer-corp',
          type: 'footer',
          content: {
            brandName: 'Apex Enterprise Consulting',
            tagline: 'Engineering the next frontier of digital capability.',
            copyright: '© 2026 Apex Enterprises. Powered by WebHub.',
          },
          style: { paddingY: 'py-10', bgType: 'dark' },
        },
      ],
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio & Creative',
    category: 'Design & Agency',
    description: 'Clean, artistic visual layout for designers, photographers, architects, and freelance professionals.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    data: {
      theme: {
        primaryColor: '#0f172a',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
      },
      sections: [
        {
          id: 'hero-port',
          type: 'hero',
          content: {
            badge: 'VISUAL DESIGNER & ART DIRECTOR',
            title: 'Crafting Visual Experiences That Resonate',
            subtitle: 'I design digital products, brand identities, and immersive UI/UX systems that captivate audiences and elevate brands.',
            primaryButtonText: 'View Selected Works',
            primaryButtonLink: '#gallery',
            secondaryButtonText: 'Get In Touch',
            secondaryButtonLink: '#contact',
            imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-24', textAlign: 'text-center', bgType: 'light' },
        },
        {
          id: 'gallery-port',
          type: 'gallery',
          content: {
            heading: 'Selected Featured Projects',
            subtitle: 'A curation of client brand identities, web apps, and design systems.',
            items: [
              {
                title: 'Fintech Dashboard UX',
                subtitle: 'Product Design',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Nordic Furniture Branding',
                subtitle: 'Visual Identity',
                imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Urban Coffee Packaging',
                subtitle: 'Art Direction',
                imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
              },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'testimonials-port',
          type: 'testimonials',
          content: {
            heading: 'Client Endorsements',
            items: [
              {
                quote: 'An exceptionally gifted designer who translated our vague ideas into a stunning, world-class product UI.',
                author: 'Elena Rostova',
                role: 'Founder, CloudFlow',
                rating: 5,
              },
              {
                quote: 'Fast turnaround, incredible communication, and attention to micro-details that blew our investors away.',
                author: 'Marcus Vance',
                role: 'CMO, Horizon Labs',
                rating: 5,
              },
            ],
          },
          style: { paddingY: 'py-16', bgType: 'gray' },
        },
        {
          id: 'contact-port',
          type: 'contact',
          content: {
            heading: 'Have a Project in Mind?',
            subtitle: 'Currently accepting freelance design inquiries and product design consultations.',
            phone: '+91 98455 67890',
            email: 'hello@creativestudio.com',
            address: 'Indiranagar 12th Main, Bengaluru, Karnataka',
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'footer-port',
          type: 'footer',
          content: {
            brandName: 'Studio Minimal',
            tagline: 'Thoughtful visual design with intentional purpose.',
            copyright: '© 2026 Studio Minimal. Built with WebHub.',
          },
          style: { paddingY: 'py-10', bgType: 'dark' },
        },
      ],
    },
  },
  {
    id: 'beauty',
    name: 'Salon & Beauty Lounge',
    category: 'Wellness & Spa',
    description: 'Chic, relaxing aesthetic for hair salons, skincare clinics, organic spas, and bridal makeovers.',
    thumbnail: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    data: {
      theme: {
        primaryColor: '#db2777',
        accentColor: '#fb7185',
        backgroundColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
      },
      sections: [
        {
          id: 'hero-beauty',
          type: 'hero',
          content: {
            badge: 'LUXURY BOTANICAL WELLNESS',
            title: 'Radiate Elegance & Inner Serenity',
            subtitle: 'Step into an oasis of calm. Experience rejuvenating organic skin therapies, customized hair rituals, and bridal transformations.',
            primaryButtonText: 'View Treatments',
            primaryButtonLink: '#services',
            secondaryButtonText: 'Book Appointment',
            secondaryButtonLink: '#contact',
            imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-24', textAlign: 'text-center', bgType: 'gradient' },
        },
        {
          id: 'services-beauty',
          type: 'features',
          content: {
            heading: 'Indulgent Signature Therapies',
            subtitle: 'Holistic treatments curated by certified aesthetic specialists.',
            items: [
              {
                title: 'Gold Radiance Hydrafacial',
                description: 'Deep pore extraction and antioxidant infusion that leaves skin visibly plump, bright, and rested.',
                icon: 'Sparkles',
              },
              {
                title: 'Keratin & Moroccan Argan Spa',
                description: 'Restores shine, eliminates frizz, and infuses essential vitamins into damaged tresses.',
                icon: 'Scissors',
              },
              {
                title: 'High-Definition Bridal Makeover',
                description: 'Customized trial sessions, draping, and flawless photographic makeup for your big celebration.',
                icon: 'Heart',
              },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'contact-beauty',
          type: 'contact',
          content: {
            heading: 'Schedule Your Pamper Session',
            subtitle: 'Tuesday - Sunday: 10:00 AM - 8:30 PM. Special bridal bookings available upon request.',
            phone: '+91 98454 56789',
            email: 'appointments@beautylounge.com',
            address: '15, Indiranagar 100ft Road, Bengaluru, Karnataka',
          },
          style: { paddingY: 'py-20', bgType: 'gray' },
        },
        {
          id: 'footer-beauty',
          type: 'footer',
          content: {
            brandName: 'Glow Botanical Lounge',
            tagline: 'Bringing out your most confident and vibrant self.',
            copyright: '© 2026 Glow Botanical Lounge. Powered by WebHub.',
          },
          style: { paddingY: 'py-10', bgType: 'dark' },
        },
      ],
    },
  },
  {
    id: 'retail',
    name: 'Small Retail & Boutique',
    category: 'Retail & Handlooms',
    description: 'Vibrant e-catalog layout for clothing boutiques, organic goods, jewelry, and specialty retail stores.',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    data: {
      theme: {
        primaryColor: '#7c3aed',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
      },
      sections: [
        {
          id: 'hero-retail',
          type: 'hero',
          content: {
            badge: 'AUTHENTIC HANDLOOMS & ETHNIC COUTURE',
            title: 'Timeless Weaves for Every Celebration',
            subtitle: 'Discover authentic Ilkal silks, pure Mysore zari crepes, and handmade ethnic treasures woven with heritage love.',
            primaryButtonText: 'Browse Catalog',
            primaryButtonLink: '#products',
            secondaryButtonText: 'Visit Boutique',
            secondaryButtonLink: '#contact',
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
          },
          style: { paddingY: 'py-24', textAlign: 'text-center', bgType: 'gradient' },
        },
        {
          id: 'products-retail',
          type: 'products',
          content: {
            heading: 'Current Festive Highlights',
            subtitle: 'Handpicked heirloom pieces directly sourced from Karnataka master weavers.',
            items: [
              {
                name: 'Traditional Ilkal Silk Saree',
                price: '₹8,500',
                description: 'Pure silk with traditional red-and-white Topetenne pallu and temple border.',
                imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
                tag: 'Heirloom',
              },
              {
                name: 'Royal Mysore Crepe Silk',
                price: '₹14,200',
                description: 'Lightweight pure silk with 100% genuine silver and gold zari motifs.',
                imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
                tag: 'Festive',
              },
              {
                name: 'Handcrafted Wooden Temple Box',
                price: '₹2,400',
                description: 'Channapatna lacquer-finished decorative jewelry storage crafted by master artisans.',
                imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
                tag: 'Handicraft',
              },
            ],
          },
          style: { paddingY: 'py-20', bgType: 'light' },
        },
        {
          id: 'contact-retail',
          type: 'contact',
          content: {
            heading: 'Visit Our Store or Place Custom Orders',
            subtitle: 'Worldwide courier shipping available. In-person styling appointments welcomed.',
            phone: '+91 98452 34567',
            email: 'sales@boutique.com',
            address: '88, Commercial Street, Shivajinagar, Bengaluru, Karnataka',
          },
          style: { paddingY: 'py-20', bgType: 'gray' },
        },
        {
          id: 'footer-retail',
          type: 'footer',
          content: {
            brandName: 'Heritage Weaves Boutique',
            tagline: 'Preserving Karnataka’s handloom pride since 1985.',
            copyright: '© 2026 Heritage Weaves Boutique. Powered by WebHub.',
          },
          style: { paddingY: 'py-10', bgType: 'dark' },
        },
      ],
    },
  },
];

exports.getTemplates = (req, res) => {
  res.json({ templates });
};

exports.getTemplateById = (req, res) => {
  const { id } = req.params;
  const template = templates.find((t) => t.id === id);
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  res.json({ template });
};
