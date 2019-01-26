const functions = require('firebase-functions');

const rp = require('request-promise');

// ========================================================================================
// onWrite：RealtimeDatabase 内で作成・更新・削除されるとトリガーされます。
// ========================================================================================
exports.flamelinkContentsMyblog = functions.database.ref('/flamelink/environments/production/content/myblog')
.onWrite(async (snap, context) => {
  // Netlify ビルド実行
  await postNetlifybuild()
  return true
})

// ========================================================================================
// Function
// ========================================================================================
function postNetlifybuild() {
  return rp({
    method: 'POST',
    uri: functions.config().netlify.webhook_url,
    body: {
      text: 'Post Netlify Build.',
    },
    json: true,
  });
}
