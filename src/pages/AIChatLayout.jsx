import { useState } from "react";
import ThreadSidebar from "../components/ThreadSidebar";
import AIAssistantPro from "./AiAssistant";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function AIChatLayout() {
  const { user: currentUser } = useContext(AuthContext);
  const [threadId, setThreadId] = useState(null);

  return (
    <main className="flex h-screen">
      <ThreadSidebar
        userId={currentUser._id}
        currentThreadId={threadId}
        setThreadId={setThreadId}
      />
      <AIAssistantPro
        userId={currentUser._id}
        threadId={threadId}
      />
    </main>
  );
}
