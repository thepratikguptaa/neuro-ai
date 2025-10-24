'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [streaming, setStreaming] = useState('');
    const [loading, setLoading] = useState('');
    const [streamResponse, setStreamResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const streamEndRef = useRef(null);

    useEffect(() => {
        const storedHistory = localStorage.getItem('chatHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const updateHistory = (newMessage) => {
        const updatedHistory = [newMessage, ...history.filter(item => item !== newMessage)].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('chatHistory');
    };

    const scrollToBottom = () => {
        streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [streamResponse]);

    const handleChat = async () => {
        setLoading(true);
        setResponse('');
        setStreamResponse('');
        updateHistory(message);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            setResponse('Error: ' + error.message);
        }
        setLoading(false);
    };

    const handleStreamChat = async () => {
        setStreaming(true);
        setResponse('');
        setStreamResponse('');
        updateHistory(message);

        try {
            const res = await fetch('/api/chat-stream', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));
                        setStreamResponse((prev) => prev + data.content);
                    }
                }
            }
        } catch (error) {
            setStreamResponse('Error: ' + error.message);
        }
        setStreaming(false);
    };

    return (
        <div className='flex min-h-screen bg-black text-white'>
            <div className={`fixed top-0 left-0 min-h-screen w-4/5 max-w-xs bg-gray-900 p-4 transform ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4 flex flex-col`}>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-bold'>History</h2>
                    <div>
                        <button onClick={clearHistory} className="text-sm text-gray-400 hover:text-white cursor-pointer">Clear</button>
                        <button onClick={() => setIsHistoryOpen(false)} className="md:hidden text-white ml-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <ul className='space-y-2 flex-1 overflow-y-auto'>
                    {history.map((item, index) => (
                        <li
                            key={index}
                            className='cursor-pointer hover:bg-gray-800 p-2 rounded text-sm truncate'
                            onClick={() => {
                                setMessage(item);
                                setIsHistoryOpen(false);
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col w-full">
                <main className="flex-grow flex flex-col items-center justify-center w-full p-4">
                    <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className={`md:hidden absolute top-4 left-4 z-10 ${isHistoryOpen ? 'hidden' : ''}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                    <div className='w-full max-w-3xl space-y-8'>
                        <h1 className='text-3xl sm:text-5xl font-bold text-center text-gray-200'>
                            Neuro AI <span className='text-gray-500'>🤖</span>
                        </h1>

                        <div className='bg-gray-900/50 p-6 sm:p-8 rounded-2xl'>
                            <textarea
                                value={message}
                                placeholder='Ask me anything...'
                                onChange={(e) => setMessage(e.target.value)}
                                className='w-full p-4 bg-gray-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-300 resize-none'
                                rows={4}
                            />
                            <div className='flex flex-col sm:flex-row justify-end gap-4 mt-4'>
                                <button
                                    className='bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                    onClick={handleChat}
                                    disabled={loading || streaming}
                                >
                                    {loading ? 'Thinking...' : 'Get Answer'}
                                </button>
                                <button
                                    className='bg-transparent border border-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                                    onClick={handleStreamChat}
                                    disabled={loading || streaming}
                                >
                                    {streaming ? 'Streaming...' : 'Stream Answer'}
                                </button>
                            </div>
                        </div>

                        {(response || streamResponse) && (
                            <div className='bg-gray-900/50 p-6 sm:p-8 rounded-2xl'>
                                {response && (
                                    <div className="text-gray-300" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: response }} />
                                )}
                                {streamResponse && (
                                    <div className="text-gray-300" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: streamResponse }} />
                                )}
                                <div ref={streamEndRef} />
                            </div>
                        )}
                    </div>
                </main>
                <footer className="text-center p-4 text-gray-500">
                    <a href="https://pratik-gupta-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        Created by Pratik Gupta
                    </a>
                </footer>
            </div>
        </div>
    );
}