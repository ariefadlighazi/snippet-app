import { useEffect, useState } from "react";
import SnippetCard from "./components/SnippetCard.jsx";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  const [editID, setEditID] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [adminPassword, setAdminPassword] = useState("");
  

  useEffect(() => {
    getSnippets();
  }, []);

  const getSnippets = async () => {
    try {
      const response = await fetch("https://snippet-api.vercel.app/snippets");
      const jsonData = await response.json();
      jsonData.sort((a, b) => b.id - a.id);
      setSnippets(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredSnippets = snippets.filter(snippet => {
    const titleMatch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase());
    const languageMatch = snippet.language.toLowerCase().includes(searchTerm.toLowerCase());

    return titleMatch || languageMatch;
  });

  const deleteSnippet = async (id) => {
    try {
      await fetch(`https://snippet-api.vercel.app/snippets/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": adminPassword
        }
      });
      toast("Snippet deleted successfully!", {
        icon: '🗑️',
      });
      setSnippets(snippets.filter(snippet => snippet.id !== id));
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong!");
    }
  }

  const editSnippet = (snippet) => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setEditID(snippet.id);
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { title, code, language };
      if (editID) {
        await fetch(`https://snippet-api.vercel.app/snippets/${editID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        toast.success("Snippet updated successfully!");
        setEditID(null);
      } else {
        await fetch("https://snippet-api.vercel.app/snippets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        toast.success("Snippet added successfully!");
      }

      setTitle("");
      setCode("");
      setLanguage("");

      getSnippets();
    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white mx-auto p-8 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{
        background: '#333',
        color: '#fff'
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-5xl mx-auto bg-slate-800 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-6">Code <span className="text-blue-400">Snippets</span></h1>
        <form onSubmit={onSubmitForm} className="flex flex-col gap-3 mb-6">
          <h3>{editID ? "Edit Snippet" : "Add New Snippet"}</h3>
          <input
            type="text"
            placeholder="input title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="input language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded-md"
          />
          <textarea
            placeholder="paste your code snippet here...."
            value={code}
            onChange={e => setCode(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded-md h-40 resize-none"
            required
          />

          <button className={`${editID ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded-md`}>{editID ? "Update Snippet" : "Add Snippet"}</button>
        </form>
        <div className="mb-4 flex justify-end">
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded-md w-1/3 bg-gray-400 text-black"
          />
        </div>
        <div className="mb-4 justify-around items-center">
          <input
            type="text"
            placeholder="Search for snippets or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-500 px-4 py-2 rounded-md w-1/3 bg-gray-400 text-black"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={editSnippet}
              onDelete={deleteSnippet}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
