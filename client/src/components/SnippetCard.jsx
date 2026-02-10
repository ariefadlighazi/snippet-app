import { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);

function SnippetCard({ snippet, onEdit, onDelete }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);

        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }
    return (
        <div key={snippet.id} className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col h-full p-4 justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2">
                <h2>{snippet.title}</h2>
                <span className="bg-gray-200 text-black px-2 py-1 rounded text-xs">{snippet.language}</span>
            </div>
            <div className="relative mb-4">
                <div className="flex-grow bg-[#282c34]">
                    <SyntaxHighlighter
                        language={snippet.language.toLowerCase()}
                        style={atomOneDark}
                        customStyle={{
                            padding: "20px",
                            backgroundColor: "transparent",
                            fontSize: "0.875rem",
                            height: "100%",
                        }}
                        wrapLongLines={true}
                    >
                        {snippet.code}
                    </SyntaxHighlighter>
                </div>
                {/* <pre className="bg-black p-4 rounded-lg overflow-x-auto max-h-48 text-green-500"><code>{snippet.code}</code></pre> */}
                <button
                    onClick={handleCopy}
                    className={`absolute top-2 right-2 ${isCopied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                    {isCopied ? '✅ Copied!' : '📋 Copy'}
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                    <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => onDelete(snippet.id)}>Delete</button>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md" onClick={() => onEdit(snippet)}>Edit</button>
                </div>
            </div>
        </div>
    );

}
export default SnippetCard;
