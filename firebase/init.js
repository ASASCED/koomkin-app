
const serviceAccount = require('./conf/brief-1521736053741-firebase-adminsdk-vdwcx-f9dc1eceb1.json');
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brief-1521736053741.firebaseio.com',
});

const settings = {timestampsInSnapshots: true};
let _db = admin.firestore();
_db.settings(settings);
// export const db: admin.firestore.Firestore = _db;

module.exports._db =  _db;
