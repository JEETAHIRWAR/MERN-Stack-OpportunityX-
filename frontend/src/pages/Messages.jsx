import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../auth/auth";
import { getSocket } from "../utils/socket";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(null);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    api.get("/conversations")
      .then(({ data }) => {
        setConversations(data);
        if (data[0]) setSelected(data[0]);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load conversations"));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    const handleMessage = (message) => {
      if (message.conversation === selected?._id) {
        setMessages((current) =>
          current.some((item) => item._id === message._id)
            ? current
            : [...current, message]
        );
      }
    };
    const handleTyping = ({ conversationId }) => {
      if (conversationId === selected?._id) setTyping(true);
    };
    const handleTypingStop = ({ conversationId }) => {
      if (conversationId === selected?._id) setTyping(false);
    };
    socket.on("message:new", handleMessage);
    socket.on("typing:start", handleTyping);
    socket.on("typing:stop", handleTypingStop);
    return () => {
      socket.off("message:new", handleMessage);
      socket.off("typing:start", handleTyping);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const socket = getSocket();
    socket.emit("conversation:join", selected._id);
    api.get(`/conversations/${selected._id}/messages`)
      .then(({ data }) => setMessages(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load messages"));
    return () => socket.emit("conversation:leave", selected._id);
  }, [selected]);

  const send = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      const { data } = await api.post(`/conversations/${selected._id}/messages`, { body });
      setMessages((current) =>
        current.some((item) => item._id === data._id)
          ? current
          : [...current, { ...data, sender: { _id: user._id, username: user.username } }]
      );
      setBody("");
      getSocket().emit("typing:stop", { conversationId: selected._id });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send message");
    }
  };

  if (!conversations) return <div className="surface-card h-96 animate-pulse" />;

  return (
    <div>
      <h1 className="text-3xl font-bold">Messages</h1>
      <p className="mt-2 text-slate-500">Application-scoped conversations with authorized participants.</p>
      <div className="surface-card mt-7 grid min-h-[560px] overflow-hidden lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <p className="p-5 font-bold">Conversations</p>
          {conversations.map((conversation) => {
            const other = conversation.participants.find((participant) => participant._id !== user._id);
            return <button key={conversation._id} type="button" onClick={() => setSelected(conversation)} className={`block w-full border-t border-slate-100 p-4 text-left ${selected?._id === conversation._id ? "bg-indigo-50" : "hover:bg-slate-50"}`}><p className="font-semibold">{other?.username || "Conversation"}</p><p className="mt-1 truncate text-xs text-slate-500">{conversation.application?.jobId?.title}</p></button>;
          })}
          {!conversations.length && <p className="p-5 text-sm text-slate-500">A conversation starts from an application.</p>}
        </aside>
        <section className="flex min-h-96 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {messages.map((message) => {
              const own = (message.sender?._id || message.sender) === user._id;
              return <div key={message._id} className={`flex ${own ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-3 ${own ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}><p>{message.body}</p><p className={`mt-1 text-[10px] ${own ? "text-indigo-200" : "text-slate-400"}`}>{new Date(message.createdAt).toLocaleTimeString()}</p></div></div>;
            })}
          </div>
          {typing && <p className="px-5 pb-2 text-xs font-semibold text-indigo-600">Typing…</p>}
          {selected && <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4"><input value={body} onChange={(event) => { setBody(event.target.value); getSocket().emit(event.target.value ? "typing:start" : "typing:stop", { conversationId: selected._id }); }} placeholder="Type a message..." className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" /><button className="primary-button">Send</button></form>}
        </section>
      </div>
    </div>
  );
};

export default Messages;
