const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// ========================================================================
// ブログ情報取得
// ========================================================================
function getMyblogSnapshot() {
  return new Promise(resolve => {
    admin.database().ref('/flamelink/environments/production/content/myblog/en-US').on('value', snapshot => resolve(snapshot.val()))
  })
}
exports.getMyblogSnapshot = getMyblogSnapshot

// ========================================================================
// ブログ情報取得 ⇒ 返却
// ========================================================================
async function selectMyblog(req, res, next) {

  try {
    // =======================================
    // 取得
    // =======================================
    let myyblogSnapshot = await getMyblogSnapshot()

    // =======================================
    // 結果
    // =======================================
    if (myyblogSnapshot) {
      res.status(200).json({ message: 'Successfully select.', myblogList: myyblogSnapshot }).end()
    }else{
      res.status(500).json({ message: 'Not success error.' }).end()
    }
    
  } catch (error) {
    console.error(error.toString())
    res.status(500).json({ message: '[catch]Not success error.' }).end()
  }
}

exports.selectMyblog = selectMyblog
