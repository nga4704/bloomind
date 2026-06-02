import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc, deleteDoc
} from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

export type ChatRole = "user" | "assistant";
export type MessageType = "ai" | "system";

export type ChatMessage = {
  content: string;
  role: ChatRole;
};

// =======================
// CREATE CONVERSATION
// =======================
export async function createConversation(
  uid: string,
  firstMessage: string
): Promise<string> {
  const ref = await addDoc(
    collection(firestore, "users", uid, "conversations"),
    {
      title: firstMessage.slice(0, 40),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: firstMessage,
    }
  );

  return ref.id;
}

// =======================
// SAVE MESSAGE (FAST - no await blocking)
// =======================
export function saveMessage(
  uid: string,
  conversationId: string,
  role: ChatRole,
  content: string,
  type: MessageType
) {
  return addDoc(
    collection(
      firestore,
      "users",
      uid,
      "conversations",
      conversationId,
      "messages"
    ),
    {
      role,
      content,
      type,
      createdAt: serverTimestamp(),
    }
  ).then(() => {
    updateDoc(
      doc(firestore, "users", uid, "conversations", conversationId),
      {
        lastMessage: content,
        updatedAt: serverTimestamp(),
      }
    );
  });
}

// =======================
// GET RECENT CONTEXT (REDUCED)
// =======================
export async function getRecentMessages(
  uid: string,
  conversationId: string
): Promise<ChatMessage[]> {
  const q = query(
    collection(
      firestore,
      "users",
      uid,
      "conversations",
      conversationId,
      "messages"
    ),
    orderBy("createdAt", "desc"),
    limit(6) // giảm latency
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => d.data())
    .reverse()
    .map((d) => ({
      role: d.role,
      content: d.content,
    }));
}

// =======================
// AI CALL (FAST)
// =======================
export async function sendMessageToAI(
  message: string,
  history: ChatMessage[],
  moodToday: any,
  userProfile: string
): Promise<{ reply: string; title?: string; personality?: string }> {
  const res = await fetch(
    "https://bloomind.vercel.app/api/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        moodToday,
        userProfile,
      }),
    }
  );

  return await res.json();
}

// =======================
// GET FULL MESSAGES (FOR HISTORY)
// =======================
export async function getMessagesByConversation(
  uid: string,
  conversationId: string
): Promise<ChatMessage[]> {
  const q = query(
    collection(
      firestore,
      "users",
      uid,
      "conversations",
      conversationId,
      "messages"
    ),
    orderBy("createdAt", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    role: d.data().role,
    content: d.data().content,
  }));
}

// =======================
// DELETE CONVERSATION
// =======================

export async function deleteConversation(
  uid: string,
  conversationId: string
) {
  try {
    const messagesRef = collection(
      firestore,
      "users",
      uid,
      "conversations",
      conversationId,
      "messages"
    );

    const snap = await getDocs(messagesRef);

    // xoá từng message
    for (const docItem of snap.docs) {
      await deleteDoc(docItem.ref);
    }

    // xoá conversation
    await deleteDoc(
      doc(firestore, "users", uid, "conversations", conversationId)
    );

    console.log("Deleted conversation:", conversationId);

  } catch (error) {
    console.log("Delete failed:", error);
    throw error;
  }
}