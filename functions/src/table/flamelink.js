const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const flamelinkCustom = require('./flamelinkCustom')

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
    let myblogSnapshot = await getMyblogSnapshot()

    // =======================================
    // 結果
    // =======================================
    if (myblogSnapshot) {
      
      // 画像URLテーブル取得
      let imageListLists = await flamelinkCustom.getImageUrl()

      let lists = {}
      let async = require('async')
      await async.forEachOf(myblogSnapshot, async (snapshot, key) => {
        lists[key] = snapshot
        const imageKey = lists[key].featuredImage[0]
        lists[key].featuredImage = []
        lists[key].featuredImage.push({ id: imageKey, url: imageListLists[imageKey].url})
      })

      console.log('▪返却データ')
      console.log(JSON.stringify(lists))

      res.status(200).json({ message: 'Successfully select.', return: { myblogList: lists } }).end()

    }else{
      res.status(500).json({ message: 'Not success error.' }).end()
    }
    
  } catch (error) {
    console.error(error.toString())
    res.status(500).json({ message: '[catch]Not success error.' }).end()
  }
}

exports.selectMyblog = selectMyblog
