import { db } from '../server/config/firebase.js';

async function testFirestore() {
  try {
    console.log("Testing Firestore connection...");
    const testDoc = db.collection('test_connection').doc('ping');
    await testDoc.set({
      message: 'Hello from ElectionIQ Server',
      timestamp: new Date()
    });
    console.log("✅ Successfully wrote to Firestore!");
    
    const snap = await testDoc.get();
    console.log("✅ Successfully read from Firestore:", snap.data());
    
    // Clean up
    await testDoc.delete();
    console.log("✅ Firestore integration is 100% successful!");
  } catch (error) {
    console.error("❌ Firestore connection failed:", error.message);
  }
}

testFirestore();
