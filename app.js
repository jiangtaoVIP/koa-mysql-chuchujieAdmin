const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const fs = require('fs')

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
// 引入中间件 统一消息返回处理
const routerResponse =  require('./middleware/routerResponse')
app.use(routerResponse()) //使用

// swagger配置
const koaSwagger = require('koa2-swagger-ui').koaSwagger;
const swagger = require('./config/swagger');
app.use(swagger.routes(), swagger.allowedMethods())
app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/swagger.json' // example path to json 其实就是之后swagger-jsdoc生成的文档地址
    }
  })
);

// 跨域
const cors = require('koa2-cors')
app.use(
  cors({
    origin: function(ctx) { //设置允许来自指定域名请求
        // if (ctx.url === '/test') {
        //     return '*'; // 允许来自所有域名请求
        // }
        // return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
        return ctx.header.origin
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    // allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
)
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// koa-bodyparser 替换为 koa-body
const koaBody = require('koa-body')
app.use(koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}))
// gzip 压缩
const compress = require('koa-compress')
// const options = { threshold: 2048 }
// app.use(compress(options))
app.use(
  compress({
    filter: function(content_type) { // 只有在请求的content-type中有gzip类型，我们才会考虑压缩，因为zlib是压缩成gzip类型的
      return /text/i.test(content_type);
    },
    threshold: 1024, // 阀值，当数据超过1kb的时候，可以压缩
    flush: require('zlib').Z_SYNC_FLUSH // zlib是node的压缩模块
  })
)
// routes
// app.use(emailVerify.routes(), emailVerify.allowedMethods())
// 直接引入文件夹的全部路由
fs.readdir('./routes', (err, files) => {
  if (!err) {
    if (files.length > 0) {
      files.forEach(item => {
        app.use(require(`./routes/${item}`).routes())
      })
      
    }
  }
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
