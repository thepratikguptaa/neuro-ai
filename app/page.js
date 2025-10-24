'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [streaming, setStreaming] = useState('');
    const [loading, setLoading] = useState('');
    const [streamResponse, setStreamResponse] = useState('');
    const streamEndRef = useRef(null);

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
        <div className='flex flex-col items-center justify-center min-h-screen bg-black text-white p-4'>
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
        </div>
    );
}