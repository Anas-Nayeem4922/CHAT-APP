import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState(["hi there"]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type : "join",
        payload : {
          roomId : "red"
        }
      }))
    }
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      <div className="min-h-[94vh]">
        {messages.map((message, idx) => (
          <div key={idx} className="rounded-lg m-6 bg-slate-200 px-8 py-1 w-fit">
            {message}
          </div>
        ))}
      </div>
      <div className="min-w-full flex">
        <input ref={inputRef} type="text" className="min-w-[85vw] min-h-[6vh] rounded-md px-4 py-2 m-2" />
        <button
          onClick={() => {
            const value = inputRef.current?.value;
            if (value && wsRef.current) {
              wsRef.current.send(
                JSON.stringify({
                  type: "message",
                  payload: {
                    message: value,
                  },
                })
              );
              inputRef.current.value = "";
            }
          }}
          className="bg-blue-300 rounded-xl px-6 py-2 ml-4 m-2"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
