const admin = require('firebase-admin')

// ========================================================================
// 画像URLデータ取得
// ========================================================================
function getImageUrl() {
  return new Promise(resolve => {
    admin.database().ref('/flamelinkCustom/imageUrl').on('value', snapshot => resolve(snapshot.val()))
  })
}
exports.getImageUrl = getImageUrl
