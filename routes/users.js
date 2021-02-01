const router = require('koa-router')()
const user = require('../api/user')
router.prefix('/user')
//  tags 可以理解成借口分类  parameters 参数
// #region
/**
 * @swagger
 * /user/login:
 *   post:
 *     description: 用户登录
 *     tags: [用户模块]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: phone
 *         description: 用户账号
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: 用户密码
 *         in: formData
 *         required: true
 *         type: string
 *       - name: captcha
 *         description: 验证码
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       0:
 *         description: 登入成功
 *         schema:
 *           type: object
 *           $ref: '#/definitions/success'
 *       -1:
 *         description: 登入失败
 *         schema:
 *           type: object
 *           $ref: '#/definitions/fail'
 *   
 */
// #endregion
router.post('/login', user.login)

module.exports = router
