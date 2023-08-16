const {onCall} = require("firebase-functions/v2/https");
import admin = form 'firebase-admin');
admin.initializeApp();

exports.updateStatusOnCall = onCall(async (data, context) => {
  const userId = data.userId; // รับ userId จากข้อมูลที่ส่งมาในการเรียกใช้งาน
  const userRef = admin.firestore().collection('Users').doc(userId);

  try {
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }

    const userData = userSnapshot.data();
    if (userData.statusUser === 'blog' && userData.expirationDate) {
      const now = new Date();
      const expirationDate = userData.expirationDate.toDate();

      if (now > expirationDate) {
        await userRef.update({
          statusUser: 'active',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { message: 'Status updated to active' };
      }
    }

    return { message: 'No update needed' };
  } catch (error) {
    console.error('Error updating status:', error.message);
    throw new functions.https.HttpsError('internal', 'Error updating status', error);
  }
});
