"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, X, Gem } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

type Message = {
    id: string;
    user_id: string;
    content: string;
    sender_type: "user" | "ai";
    created_at: string;
};

export default function ChatInterface() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchMessages(user.id);
        } else {
            setMessages([]);
        }
    }, [user?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel("realtime-messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.find((m) => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                    if (newMessage.sender_type === "ai") {
                        setIsTyping(false);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const fetchMessages = async (uid: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
        } else if (data) {
            // Explicitly sort it in memory to guarantee chronological order
            // (Oldest first, newest last)
            const sortedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            setMessages(sortedData);
        }
    };

    const renderMessageContent = (content: string) => {
        // Parse markdown images ![alt](url)
        const parts = content.split(/(!\[.*?\]\(.*?\))/g);
        return parts.map((part, i) => {
            const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
                return (
                    <div key={i} className="my-3">
                        <img src={imageMatch[2]} alt={imageMatch[1]} className="w-full rounded-md shadow-sm border border-border/10 object-cover" />
                    </div>
                );
            }
            // Use whitespace-pre-line to respect newlines but wrap normally, break-words to handle long links
            return <div key={i} className="whitespace-pre-line leading-relaxed break-words w-full">{part}</div>;
        });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user?.id) return;

        const userMessage = input.trim();
        setInput("");

        // optimistic UI update for better UX
        const optimisticMsg: Message = {
            id: Date.now().toString(),
            user_id: user.id,
            content: userMessage,
            sender_type: "user",
            created_at: new Date().toISOString()
        }

        setMessages(prev => [...prev, optimisticMsg])
        setIsTyping(true);

        const { error } = await supabase.from("messages").insert({
            user_id: user.id,
            content: userMessage,
            sender_type: "user",
        });

        if (!error) {
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, message: userMessage }),
                });
                const data = await res.json();

                if (data.reply) {
                    setIsTyping(false);
                    // Force update local state in case realtime failed to deliver
                    setMessages(prev => {
                        if (prev.find(m => m.content === data.reply)) return prev;
                        return [...prev, {
                            id: Date.now().toString() + "-ai",
                            user_id: user.id,
                            content: data.reply,
                            sender_type: "ai",
                            created_at: new Date().toISOString()
                        }];
                    });
                } else {
                    setIsTyping(false);
                }
            } catch (err) {
                console.error("API error:", err);
                setIsTyping(false);
            }
        } else {
            console.error("Error sending message:", error);
            setIsTyping(false);
        }
    };

    if (!isMounted || !user?.id) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 bg-[#111118] hover:bg-[#111118]/90 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-black/20"
                >
                    <Gem size={24} strokeWidth={1.5} className="text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[90vw] sm:w-[450px] flex flex-col border border-border/50 animate-in slide-in-from-bottom-5 duration-500 rounded-2xl overflow-hidden backdrop-blur-sm bg-white shadow-2xl" style={{ height: '700px', maxHeight: '85vh' }}>
                    <CardHeader className="bg-white text-foreground p-4 flex flex-row items-center justify-between border-b shrink-0">
                        <CardTitle className="text-lg font-serif font-medium tracking-wide flex items-center gap-3">
                            <Avatar className="w-8 h-8 border border-foreground/20">
                                <AvatarFallback className="bg-foreground text-xs text-background font-sans tracking-widest">LS</AvatarFallback>
                            </Avatar>
                            Luxury Concierge
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={18} />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 relative bg-white overflow-hidden">
                        <ScrollArea className="h-full w-full p-5" ref={scrollRef}>
                            <div className="flex flex-col gap-6">
                                {messages.length === 0 && (
                                    <div className="text-center text-sm text-muted-foreground mt-12 space-y-3 font-serif">
                                        <div className="w-12 h-12 rounded-full border border-border mx-auto flex items-center justify-center bg-stone-50">
                                            <MessageCircle className="h-5 w-5 text-foreground/50" />
                                        </div>
                                        <p className="tracking-wide">How may we assist you today?</p>
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={msg.id || idx}
                                        className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div className={`flex max-w-[95%] items-start animate-in fade-in slide-in-from-bottom-2 ${msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                            <div
                                                className={`text-[15px] leading-relaxed min-w-0 break-words ${msg.sender_type === "user"
                                                    ? "bg-[#111118] text-white p-3.5 px-4 rounded-2xl rounded-tr-sm shadow-sm"
                                                    : "bg-stone-50 border border-border/40 p-3.5 px-4 rounded-2xl rounded-tl-sm text-foreground w-full shadow-sm"
                                                    }`}
                                            >
                                                {renderMessageContent(msg.content)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 items-start max-w-[80%] animate-in fade-in">
                                            <div className="p-4 py-5 bg-transparent rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[42px]">
                                                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <div className="p-3 bg-white border-t shrink-0 z-20">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2 items-center">
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 rounded-lg border-stone-200 bg-white focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0 text-[15px] h-12 transition-colors px-4 text-foreground shadow-sm"
                                disabled={isTyping}
                                maxLength={500}
                            />
                            <Button type="submit" size="icon" className="bg-[#111118] hover:bg-[#111118]/90 text-white rounded-lg shrink-0 shadow-sm h-12 w-12 transition-transform active:scale-95" disabled={isTyping || !input.trim()}>
                                <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}
        </div>
    );
}
