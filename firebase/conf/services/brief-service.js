// import * as admin from 'firebase-admin';
var admin = require('firebase-admin');
const serviceAccount = require('../brief-1521736053741-firebase-adminsdk-vdwcx-f9dc1eceb1');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brief-1521736053741.firebaseio.com',
});

const settings = {timestampsInSnapshots: true};
const _db = admin.firestore();

_db.settings(settings);

async function getBriefById(idBrief) {
  return _db.collection('brief').where('id', '==', idBrief).get()
}

async function getBriefByEmail(email) {
  return _db.collection('brief').where('email', '==', email).get()
}

async function updateBriefById(idBrief,value) {
  const data = {login: value};
  return _db.collection('brief').doc(idBrief).update(data);
}

module.exports.getBriefById = getBriefById;
module.exports.getBriefByEmail = getBriefByEmail;
module.exports.updateBriefById = updateBriefById;

