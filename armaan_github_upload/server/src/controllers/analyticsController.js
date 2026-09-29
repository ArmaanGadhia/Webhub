const prisma = require('../prisma/client');
const crypto = require('crypto');

exports.trackEvent = async (req, res) => {
  try {
    const { websiteSlug, websiteId, eventType = 'VIEW', page = 'home', metadata } = req.body;

    let targetWebsiteId = websiteId ? parseInt(websiteId) : null;
    if (!targetWebsiteId && websiteSlug) {
      const site = await prisma.website.findUnique({
        where: { slug: websiteSlug },
        select: { id: true },
      });
      if (site) targetWebsiteId = site.id;
    }

    if (!targetWebsiteId) {
      return res.status(404).json({ message: 'Target website not found for tracking.' });
    }

    // Generate hashed IP for anonymous unique visitor estimation
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const visitorIpHash = crypto.createHash('md5').update(ip).digest('hex').substring(0, 16);

    const record = await prisma.analytics.create({
      data: {
        websiteId: targetWebsiteId,
        eventType,
        visitorIpHash,
        page,
        metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata || null,
      },
    });

    res.status(201).json({ success: true, id: record.id });
  } catch (error) {
    console.error('trackEvent error:', error);
    res.status(500).json({ message: 'Tracking failed.' });
  }
};

exports.getWebsiteAnalytics = async (req, res) => {
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

    // Ownership check
    if (req.user.role !== 'ADMIN' && website.business.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const totalViews = await prisma.analytics.count({
      where: { websiteId, eventType: 'VIEW' },
    });

    const totalClicks = await prisma.analytics.count({
      where: { websiteId, eventType: 'CLICK' },
    });

    // 7-day daily breakdown
    const past7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const count = await prisma.analytics.count({
        where: {
          websiteId,
          eventType: 'VIEW',
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      past7Days.push({ date: dayName, views: count });
    }

    res.json({
      website: { id: website.id, name: website.name, slug: website.slug },
      totalViews,
      totalClicks,
      past7Days,
    });
  } catch (error) {
    console.error('getWebsiteAnalytics error:', error);
    res.status(500).json({ message: 'Failed to retrieve website analytics.' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userBusinesses = await prisma.business.findMany({
      where: { userId: req.user.id },
      include: {
        websites: true,
        _count: {
          select: { enquiries: true },
        },
      },
    });

    const businessIds = userBusinesses.map((b) => b.id);
    const websites = userBusinesses.flatMap((b) => b.websites);
    const websiteIds = websites.map((w) => w.id);

    const publishedWebsites = websites.filter((w) => w.status === 'PUBLISHED').length;

    const totalEnquiries = userBusinesses.reduce((acc, curr) => acc + curr._count.enquiries, 0);

    const totalViews = await prisma.analytics.count({
      where: {
        websiteId: { in: websiteIds },
        eventType: 'VIEW',
      },
    });

    // 7-day trend across user's websites
    const past7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const count = await prisma.analytics.count({
        where: {
          websiteId: { in: websiteIds },
          eventType: 'VIEW',
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short' });
      past7Days.push({ day: dayName, views: count });
    }

    res.json({
      totalViews,
      totalWebsites: websites.length,
      publishedWebsites,
      totalEnquiries,
      past7Days,
      businesses: userBusinesses,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBusinesses,
      publishedWebsites,
      pendingApprovals,
      totalViews,
      totalEnquiries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.website.count({ where: { status: 'PUBLISHED' } }),
      prisma.business.count({ where: { status: 'PENDING' } }),
      prisma.analytics.count({ where: { eventType: 'VIEW' } }),
      prisma.enquiry.count(),
    ]);

    // Categories with business counts
    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: {
          select: { businesses: true },
        },
      },
      orderBy: { businesses: { _count: 'desc' } },
      take: 6,
    });

    // Recent 5 businesses
    const recentBusinesses = await prisma.business.findMany({
      include: {
        category: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({
      totalUsers,
      totalBusinesses,
      publishedWebsites,
      pendingApprovals,
      totalViews,
      totalEnquiries,
      categoryStats,
      recentBusinesses,
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics.' });
  }
};
