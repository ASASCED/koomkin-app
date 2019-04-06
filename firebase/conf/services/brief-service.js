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

async function getBrief(idBrief) {
  return _db.collection('brief').where('id', '==', idBrief).get()
}

async function updateBrief(idBrief) {
  const data = {prueba: 'Sexo anal'};
  return _db.collection('brief').doc(idBrief).update(data);
}

module.exports.getBrief = getBrief;
module.exports.updateBrief = updateBrief;

