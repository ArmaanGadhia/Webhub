const prisma = require('../prisma/client');

exports.createEnquiry = async (req, res) => {
  try {
    const { businessId, websiteSlug, name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    let targetBusinessId = businessId ? parseInt(businessId) : null;

    if (!targetBusinessId && websiteSlug) {
      const site = await prisma.website.findUnique({
        where: { slug: websiteSlug },
        select: { businessId: true },
      });
      if (site) targetBusinessId = site.businessId;
    }

    if (!targetBusinessId) {
      return res.status(400).json({ message: 'Target business could not be identified.' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        businessId: targetBusinessId,
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        message: message.trim(),
        status: 'NEW',
      },
    });

    res.status(201).json({
      message: 'Your enquiry has been delivered directly to the business owner!',
      enquiry,
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    res.status(500).json({ message: 'Failed to submit enquiry. Please try again.' });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const { status, all } = req.query;
    const where = {};

    if (req.user.role === 'ADMIN' && all === 'true') {
      if (status) where.status = status;
    } else {
      const userBusinesses = await prisma.business.findMany({
        where: { userId: req.user.id },
        select: { id: true },
      });
      const ids = userBusinesses.map((b) => b.id);
      where.businessId = { in: ids };
      if (status) where.status = status;
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        business: {
          select: { id: true, businessName: true, slug: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ enquiries });
  } catch (error) {
    console.error('getEnquiries error:', error);
    res.status(500).json({ message: 'Failed to fetch enquiries.' });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'READ', 'RESPONDED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid enquiry status.' });
    }

    const updated = await prisma.enquiry.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { business: true },
    });

    res.json({ message: `Enquiry updated to ${status}`, enquiry: updated });
  } catch (error) {
    console.error('updateEnquiryStatus error:', error);
    res.status(500).json({ message: 'Failed to update enquiry status.' });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enquiry.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Enquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete enquiry.' });
  }
};
