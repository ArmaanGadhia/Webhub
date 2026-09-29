const prisma = require('../prisma/client');

exports.getCategories = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const where = {};
    if (!includeInactive) {
      where.status = 'ACTIVE';
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            businesses: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        businesses: {
          where: { status: 'APPROVED' },
          include: {
            websites: {
              where: { status: 'PUBLISHED' },
              select: { slug: true, status: true },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category details.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon = 'Briefcase', description, status = 'ACTIVE' } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name: name.trim() }, { slug }] },
    });

    if (existing) {
      return res.status(400).json({ message: 'A category with this name or slug already exists.' });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        icon,
        description,
        status,
      },
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('createCategory error:', error);
    res.status(500).json({ message: 'Failed to create category.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, status } = req.body;

    const data = {};
    if (name) {
      data.name = name.trim();
      data.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (icon !== undefined) data.icon = icon;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const businessCount = await prisma.business.count({
      where: { categoryId: parseInt(id) },
    });

    if (businessCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category because ${businessCount} business(es) are associated with it. Please reassign them first or set category to inactive.`,
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category.' });
  }
};
