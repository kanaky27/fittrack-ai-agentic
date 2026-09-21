import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageSquare, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../api';
import Card from '../ui/Card';

interface ChatMessage {
    id: number;
    role: 'user' | 'model';
    content: string;
}

export default function AICoach() {
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestedPrompts = [
        "What should I eat for dinner tonight?",
        "Create a quick 20-minute workout for me.",
        "Am I eating enough protein?",
        "How can I reach my weight goal faster?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat-messages?populate=*&filters[user][id][$eq]=${user?.id}&sort=createdAt:desc&pagination[limit]=20`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const fetchedMessages = res.data.data.map((msg: any) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content
                })).reverse();
                
                if (fetchedMessages.length === 0) {
                    setMessages([{
                        id: 0,
                        role: 'model',
                        content: `Hi ${user?.username}! I'm your AI Fitness Coach. I can see your daily calorie goals, food logs, and activity. How can I help you today?`
                    }]);
                } else {
                    setMessages(fetchedMessages);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        
        const tempId = Date.now();
        const newMsg: ChatMessage = { id: tempId, role: 'user', content: text };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: text }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            
            const aiMsg: ChatMessage = {
                id: res.data.data.id,
                role: 'model',
                content: res.data.data.content
            };
            
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'model',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatMessage = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            if (formattedLine.startsWith('# ')) {
                return <h1 key={i} className="text-xl font-bold mb-2 mt-4" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />;
            } else if (formattedLine.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-bold mb-2 mt-3" dangerouslySetInnerHTML={{ __html: formattedLine.substring(3) }} />;
            } else if (formattedLine.startsWith('### ')) {
                return <h3 key={i} className="font-bold mb-1 mt-2" dangerouslySetInnerHTML={{ __html: formattedLine.substring(4) }} />;
            } else if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }} />;
            } else if (formattedLine.trim() === '') {
                return <div key={i} className="h-2" />;
            } else {
                return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
            }
        });
    };

    return (
        <div className="page-container flex flex-col h-screen max-h-screen pb-4">
            <div className="page-header shrink-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-emerald-500" />
                    AI Coach
                </h1>
                <p className="text-slate-500 mt-1">Your personalized fitness and nutrition assistant.</p>
            </div>

            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden mt-4">
                {historyLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                        {formatMessage(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                            {messages.length <= 1 && !loading && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {suggestedPrompts.map((prompt, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleSend(prompt)}
                                            className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form 
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleSend(input);
                                }} 
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ask your AI coach anything..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 dark:text-white"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
