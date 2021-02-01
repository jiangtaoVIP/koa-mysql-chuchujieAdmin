const bcrypt = require('bcryptjs')
// 【同步加密和验证】
exports.encrypt = (pass) => {
  // 随机字符串
  const salt = bcrypt.genSaltSync(10)
  // 对明文加密
  const hash = bcrypt.hashSync(pass, salt)
  console.log(hash, '加密后的')
  return hash
}

// 验证比对,返回布尔值表示验证结果 true表示一致，false表示不一致
exports.decrypt = (pass, hash) => {
  console.log(bcrypt.compareSync(pass, hash), '验证比对,返回布尔值表示验证结果 true表示一致，false表示不一致')
  return bcrypt.compareSync(pass, hash) 
}