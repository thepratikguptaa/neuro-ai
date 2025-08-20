'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [streaming, setStreaming] = useState('');
    const [loading, setLoading] = useState('');
    const [streamResponse, setStreamResponse] = useState('');

    const handleChat = async () => {
        setLoading(true);
        setResponse('');

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
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8'>
            <div className='w-full max-w-2xl'>
                <h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 animate-bounce'>
                    Welcome to Neuro AI 🤖
                </h1>

                <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700'>
                    <textarea
                        value={message}
                        placeholder='Enter your message here...'
                        onChange={(e) => setMessage(e.target.value)}
                        className='w-full p-3 bg-gray-700 bg-opacity-50 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300'
                        rows={4}
                    />
                    <div className='flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-4'>
                        <button
                            className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 cursor-pointer transform hover:scale-105'
                            onClick={handleChat}
                            disabled={loading || streaming}
                        >
                            {loading ? 'Loading...' : 'Chat'}
                        </button>
                        <button
                            className='bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 cursor-pointer transform hover:scale-105'
                            onClick={handleStreamChat}
                            disabled={loading || streaming}
                        >
                            {streaming ? 'Streaming...' : 'Stream Chat'}
                        </button>
                    </div>
                </div>

                {(response || streamResponse) && (
                    <div className='mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700'>
                        <h2 className='text-2xl font-semibold mb-4'>
                            AI Response
                        </h2>
                        {response && (
                            <div className="text-gray-300 mb-4" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: response }} />
                        )}
                        {streamResponse && (
                            <div className="text-gray-300" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: streamResponse }} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}