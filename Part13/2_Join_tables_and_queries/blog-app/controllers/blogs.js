const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { fn, col } = require('sequelize')
const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

// Token extractor middleware
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// Blog finder middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

// Get all blogs with filtering and searching
router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

// Create blog (requires authentication)
router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id
    })
    res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

// Update blog likes
router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// Delete blog (only by owner)
router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog) {
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'only the creator can delete a blog' })
    }
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router
