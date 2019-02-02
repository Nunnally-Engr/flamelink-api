const functions = require('firebase-functions');

const rp = require('request-promise');

const cors = require('cors')({origin: true})
const express = require('express')
const app = express()


const flamelink = require('./src/table/flamelink')

// ========================================================================================
// onRequest：ブログ情報返却
// ========================================================================================
const ex1 = express()
ex1.use(cors)
ex1.use(flamelink.selectMyblog)
exports.selectMyblog = functions.https.onRequest(ex1)

// ========================================================================================
// onWrite：RealtimeDatabase 内で作成・更新・削除されるとトリガーされます。
// ========================================================================================
exports.onWriteMyblog = functions.database.ref('/flamelink/environments/production/content/myblog')
.onWrite(async (snap, context) => {
  console.log('=== 変更内容[snap] ===')
  console.log(snap)
  // Netlify ビルド実行
  await runBuildByNetlify()
  return true
})

// ========================================================================================
// Function
// ========================================================================================
// Netlify ビルド実行
function runBuildByNetlify() {
  return rp({
    method: 'POST',
    uri: functions.config().netlify.webhook_url,
    body: {
      text: 'Run build by Netfly.',
    },
    json: true,
  });
}
