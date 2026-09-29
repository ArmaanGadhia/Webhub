const prisma = require('../prisma/client');

// Helper to generate a clean slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getBusinesses = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      status = 'APPROVED',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    // For public directory, only show APPROVED businesses.
    // If an authenticated admin requests all, they can pass status=ALL or specific status.
    if (status !== 'ALL') {
      where.status = status;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (city) {
      where.city = {
        contains: city,
      };
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { businessName: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
        { address: { contains: q } },
        {
          category: {
            name: { contains: q },
          },
        },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'name_asc') orderBy = { businessName: 'asc' };
    if (sort === 'name_desc') orderBy = { businessName: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const [total, businesses] = await Promise.all([
      prisma.business.count({ where }),
      prisma.business.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
          websites: {
            where: { status: 'PUBLISHED' },
            select: { id: true, name: true, slug: true, status: true, publishedAt: true },
          },
          _count: {
            select: { enquiries: true },
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    res.json({
      businesses,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (error) {
    console.error('getBusinesses error:', error);
    res.status(500).json({ message: 'Failed to fetch businesses.' });
  }
};

exports.getBusinessByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = !isNaN(identifier);

    const where = isNumeric ? { id: parseInt(identifier) } : { slug: identifier };

    const business = await prisma.business.findUnique({
      where,
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        websites: {
          include: {
            _count: {
              select: { analytics: true },
            },
          },
        },
        enquiries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.json({ business });
  } catch (error) {
    console.error('getBusinessByIdOrSlug error:', error);
    res.status(500).json({ message: 'Failed to fetch business details.' });
  }
};

exports.getMyBusiness = async (req, res) => {
  try {
    const business = await prisma.business.findFirst({
      where: { userId: req.user.id },
      include: {
        category: true,
        websites: true,
        _count: {
          select: { enquiries: true },
        },
      },
    });

    res.json({ business });
  } catch (error) {
    console.error('getMyBusiness error:', error);
    res.status(500).json({ message: 'Failed to fetch your business.' });
  }
};

exports.createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      categoryId,
      description,
      logo,
      coverImage,
      phone,
      email,
      website,
      address,
      city,
      state,
      pincode,
      openingHours,
      socialLinks,
    } = req.body;

    if (!businessName) {
      return res.status(400).json({ message: 'Business name is required.' });
    }

    if (!categoryId) {
      return res.status(400).json({ message: 'Business category is required.' });
    }

    let baseSlug = generateSlug(businessName);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const business = await prisma.business.create({
      data: {
        userId: req.user.id,
        categoryId: parseInt(categoryId),
        businessName: businessName.trim(),
        slug: uniqueSlug,
        description: description ? description.trim() : null,
        logo: logo || null,
        coverImage: coverImage || null,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        website: website ? website.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        pincode: pincode ? pincode.trim() : null,
        openingHours: openingHours ? openingHours.trim() : null,
        socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks || null,
        status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        approvedAt: req.user.role === 'ADMIN' ? new Date() : null,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({ message: 'Business profile created successfully', business });
  } catch (error) {
    console.error('createBusiness error:', error);
    res.status(500).json({ message: 'Failed to create business profile.' });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = parseInt(id);

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    // Verify ownership or admin role
    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to edit this business.' });
    }

    const {
      businessName,
      categoryId,
      description,
      logo,
      coverImage,
      phone,
      email,
      website,
      address,
      city,
      state,
      pincode,
      openingHours,
      socialLinks,
    } = req.body;

    const data = {};
    if (businessName) data.businessName = businessName.trim();
    if (categoryId) data.categoryId = parseInt(categoryId);
    if (description !== undefined) data.description = description;
    if (logo !== undefined) data.logo = logo;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (website !== undefined) data.website = website;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (pincode !== undefined) data.pincode = pincode;
    if (openingHours !== undefined) data.openingHours = openingHours;
    if (socialLinks !== undefined) {
      data.socialLinks = typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks;
    }

    const updated = await prisma.business.update({
      where: { id: businessId },
      data,
      include: {
        category: true,
        websites: true,
      },
    });

    res.json({ message: 'Business profile updated successfully', business: updated });
  } catch (error) {
    console.error('updateBusiness error:', error);
    res.status(500).json({ message: 'Failed to update business profile.' });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = parseInt(id);

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized to delete this business.' });
    }

    await prisma.business.delete({
      where: { id: businessId },
    });

    res.json({ message: 'Business deleted successfully.' });
  } catch (error) {
    console.error('deleteBusiness error:', error);
    res.status(500).json({ message: 'Failed to delete business.' });
  }
};

// Admin status update (Approve/Reject)
exports.updateBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const data = {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason || 'Information incomplete' : null,
      approvedAt: status === 'APPROVED' ? new Date() : null,
    };

    const updated = await prisma.business.update({
      where: { id: parseInt(id) },
      data,
      include: {
        category: true,
        user: { select: { name: true, email: true } },
      },
    });

    res.json({ message: `Business has been marked as ${status}`, business: updated });
  } catch (error) {
    console.error('updateBusinessStatus error:', error);
    res.status(500).json({ message: 'Failed to update business status.' });
  }
};
