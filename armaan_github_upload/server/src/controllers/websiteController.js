const prisma = require('../prisma/client');

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getWebsites = async (req, res) => {
  try {
    const { status, all } = req.query;
    const where = {};

    // If admin requests all
    if (req.user.role === 'ADMIN' && all === 'true') {
      if (status) where.status = status;
    } else {
      // Find businesses belonging to the user
      const userBusinesses = await prisma.business.findMany({
        where: { userId: req.user.id },
        select: { id: true },
      });
      const businessIds = userBusinesses.map((b) => b.id);
      where.businessId = { in: businessIds };
      if (status) where.status = status;
    }

    const websites = await prisma.website.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            status: true,
            logo: true,
            category: { select: { name: true } },
          },
        },
        _count: {
          select: { analytics: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ websites });
  } catch (error) {
    console.error('getWebsites error:', error);
    res.status(500).json({ message: 'Failed to fetch websites.' });
  }
};

exports.getWebsiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const websiteId = parseInt(id);

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        business: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'ADMIN' && website.business.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this website.' });
    }

    res.json({ website });
  } catch (error) {
    console.error('getWebsiteById error:', error);
    res.status(500).json({ message: 'Failed to fetch website.' });
  }
};

exports.getPublicWebsiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const website = await prisma.website.findUnique({
      where: { slug },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            description: true,
            logo: true,
            coverImage: true,
            phone: true,
            email: true,
            website: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
            openingHours: true,
            socialLinks: true,
            status: true,
            category: {
              select: { name: true, slug: true, icon: true },
            },
          },
        },
      },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    // Only allow published websites publicly (or preview if authorized owner)
    if (website.status !== 'PUBLISHED') {
      return res.status(403).json({
        message: 'This website is currently in draft mode and is not published yet.',
        isDraft: true,
      });
    }

    res.json({ website });
  } catch (error) {
    console.error('getPublicWebsiteBySlug error:', error);
    res.status(500).json({ message: 'Failed to fetch published website.' });
  }
};

exports.createWebsite = async (req, res) => {
  try {
    const { businessId, name, slug, template = 'custom', contentJson } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required.' });
    }

    const business = await prisma.business.findUnique({
      where: { id: parseInt(businessId) },
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized for this business.' });
    }

    let siteName = name || `${business.businessName} Website`;
    let baseSlug = generateSlug(slug || business.businessName);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.website.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const defaultContent = contentJson || JSON.stringify({
      theme: {
        primaryColor: '#2563eb',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
      },
      sections: [
        {
          id: `hero-${Date.now()}`,
          type: 'hero',
          content: {
            badge: 'WELCOME TO OUR OFFICIAL SITE',
            title: business.businessName,
            subtitle: business.description || 'Discover our products, premium services, and dedicated craftsmanship.',
            primaryButtonText: 'Explore More',
            primaryButtonLink: '#services',
            secondaryButtonText: 'Contact Us',
            secondaryButtonLink: '#contact',
            imageUrl: business.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          },
          style: {
            paddingY: 'py-20',
            textAlign: 'text-center',
            bgType: 'gradient',
          },
        },
        {
          id: `contact-${Date.now() + 1}`,
          type: 'contact',
          content: {
            heading: 'Get In Touch',
            subtitle: 'We look forward to serving your needs. Reach out directly below.',
            phone: business.phone || '+91 98765 43210',
            email: business.email || 'contact@example.com',
            address: business.address ? `${business.address}, ${business.city || ''}` : 'Main Street, City Center',
          },
          style: {
            paddingY: 'py-16',
            bgType: 'light',
          },
        },
        {
          id: `footer-${Date.now() + 2}`,
          type: 'footer',
          content: {
            brandName: business.businessName,
            tagline: 'Delivering excellence every single day.',
            copyright: `© ${new Date().getFullYear()} ${business.businessName}. Built with WebHub.`,
          },
          style: {
            paddingY: 'py-8',
            bgType: 'dark',
          },
        },
      ],
    });

    const website = await prisma.website.create({
      data: {
        businessId: parseInt(businessId),
        name: siteName,
        slug: uniqueSlug,
        template,
        contentJson: defaultContent,
        status: 'DRAFT',
      },
      include: {
        business: true,
      },
    });

    res.status(201).json({ message: 'Website created successfully in draft mode.', website });
  } catch (error) {
    console.error('createWebsite error:', error);
    res.status(500).json({ message: 'Failed to create website.' });
  }
};

exports.updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const websiteId = parseInt(id);
    const { name, slug, template, contentJson } = req.body;

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { business: true },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    if (website.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to edit this website.' });
    }

    const data = {};
    if (name) data.name = name.trim();
    if (template) data.template = template;
    if (contentJson) {
      data.contentJson = typeof contentJson === 'object' ? JSON.stringify(contentJson) : contentJson;
    }

    if (slug && slug !== website.slug) {
      const cleanSlug = generateSlug(slug);
      const conflict = await prisma.website.findUnique({ where: { slug: cleanSlug } });
      if (conflict && conflict.id !== websiteId) {
        return res.status(400).json({ message: 'This slug URL is already taken by another website.' });
      }
      data.slug = cleanSlug;
    }

    const updated = await prisma.website.update({
      where: { id: websiteId },
      data,
      include: { business: true },
    });

    res.json({ message: 'Website saved successfully.', website: updated });
  } catch (error) {
    console.error('updateWebsite error:', error);
    res.status(500).json({ message: 'Failed to save website changes.' });
  }
};

exports.publishWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const websiteId = parseInt(id);

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { business: true },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    if (website.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to publish this website.' });
    }

    // Validate that contentJson is valid JSON and has sections
    try {
      const parsed = JSON.parse(website.contentJson);
      if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
        return res.status(400).json({ message: 'Cannot publish an empty website. Add at least one section.' });
      }
    } catch (e) {
      return res.status(400).json({ message: 'Website content format is invalid.' });
    }

    const published = await prisma.website.update({
      where: { id: websiteId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: { business: true },
    });

    // Also update business website field if empty
    await prisma.business.update({
      where: { id: website.businessId },
      data: {
        website: `/site/${website.slug}`,
      },
    });

    res.json({
      message: `Website published successfully! It is now live at /site/${published.slug}`,
      website: published,
    });
  } catch (error) {
    console.error('publishWebsite error:', error);
    res.status(500).json({ message: 'Failed to publish website.' });
  }
};

exports.unpublishWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const websiteId = parseInt(id);

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { business: true },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    if (website.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to unpublish this website.' });
    }

    const unpublished = await prisma.website.update({
      where: { id: websiteId },
      data: {
        status: 'DRAFT',
      },
    });

    res.json({ message: 'Website has been unpublished and returned to draft.', website: unpublished });
  } catch (error) {
    console.error('unpublishWebsite error:', error);
    res.status(500).json({ message: 'Failed to unpublish website.' });
  }
};

exports.deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const websiteId = parseInt(id);

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { business: true },
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    if (website.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to delete this website.' });
    }

    await prisma.website.delete({
      where: { id: websiteId },
    });

    res.json({ message: 'Website deleted successfully.' });
  } catch (error) {
    console.error('deleteWebsite error:', error);
    res.status(500).json({ message: 'Failed to delete website.' });
  }
};
