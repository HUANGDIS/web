let commonFun = {
  // 前端获取公钥加密并传递给后端：
  icsEncryptByRSA: (data) => {
    let publicKey = ''
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey)
    return encryptor.encrypt(data)
  }
}
export default commonFun