const router = require('koa-router')()

router.prefix('/')
// 定义模型 可以公用 schema $ref
/**
 * @swagger
 * definitions:
 *   success:
 *     properties:
 *       code:
 *         type: number
 *       msg:
 *         type: string
 *       data:
 *         type: object
 *   fail:
 *     properties:
 *       code:
 *         type: number
 *       msg:
 *         type: string
 */
router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router
