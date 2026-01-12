'use client';

import React, { useState } from 'react';
import { useIssues, Issue, IssuePriority, Comment } from '@/context/IssueContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ArrowLeft,
    Send,
    MessageSquare,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
    Info,
    MoreHorizontal,
    CornerDownRight,
    User
} from 'lucide-react';

export default function IssueSidebar() {
    const { issues, addComment, updateIssueStatus } = useIssues();
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyToId, setReplyToId] = useState<string | null>(null);

    const selectedIssue = issues.find(i => i.id === selectedIssueId);

    const getPriorityColor = (p: IssuePriority) => {
        switch (p) {
            case 'critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIssueId || !commentText.trim()) return;

        addComment(selectedIssueId, commentText, replyToId || undefined);
        setCommentText('');
        setReplyToId(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const config = {
            open: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', text: 'Open' },
            in_progress: { color: 'text-blue-400', bg: 'bg-blue-500/10', text: 'In Progress' },
            done: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', text: 'Resolved' },
            blocked: { color: 'text-rose-400', bg: 'bg-rose-500/10', text: 'Blocked' },
        }[status] || { color: 'text-zinc-400', bg: 'bg-zinc-500/10', text: status };

        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border border-transparent ${config.color} ${config.bg}`}>
                {config.text}
            </span>
        );
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`group ${isReply ? 'ml-8 mt-2' : 'mt-4'}`}>
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-zinc-200">{comment.author}</span>
                            <span className="text-[10px] text-zinc-500">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="text-sm text-zinc-300 leading-relaxed break-words bg-[#1a1a1e] p-3 rounded-2xl rounded-tl-sm border border-white/[0.04] group-hover:border-white/[0.08] transition-colors relative">
                        {comment.content}
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 ml-1">
                        <button
                            onClick={() => setReplyToId(comment.id)}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-indigo-400 transition-colors"
                        >
                            <CornerDownRight className="w-3 h-3" />
                            Reply
                        </button>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                        <div>
                            {comment.replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <aside className="w-full h-full bg-[#0a0a0c] flex flex-col font-sans border-l border-white/[0.04]">
            {/* Header */}
            <div className="h-14 shrink-0 flex items-center px-4 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/[0.04] z-10 sticky top-0">
                {selectedIssue ? (
                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={() => setSelectedIssueId(null)}
                            className="p-1.5 -ml-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-medium text-white truncate">{selectedIssue.title}</h2>
                        </div>
                        <StatusBadge status={selectedIssue.status} />
                    </div>
                ) : (
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-indigo-400" />
                            Detected Issues
                        </h2>
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-zinc-900 bg-white rounded-full">
                            {issues.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                <AnimatePresence mode="wait">
                    {selectedIssue ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-full flex flex-col"
                        >
                            {/* Issue Details Box */}
                            <div className="p-5 border-b border-white/[0.04] bg-white/[0.01]">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getPriorityColor(selectedIssue.priority)}`}>
                                        {selectedIssue.priority}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-zinc-800 border border-transparent">
                                        {selectedIssue.type}
                                    </span>
                                </div>
                                <h1 className="text-lg font-semibold text-white mb-3 leading-snug">{selectedIssue.title}</h1>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{selectedIssue.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-[#111114] border border-white/[0.04]">
                                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Impact</div>
                                        <div className="text-xs font-medium text-zinc-300 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            {selectedIssue.linkedEntityName}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-[#111114] border border-white/[0.04]">
                                        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Assignee</div>
                                        <div className="text-xs font-medium text-zinc-300 flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[8px] font-bold">
                                                {selectedIssue.assignedTo ? selectedIssue.assignedTo.charAt(0) : '?'}
                                            </div>
                                            {selectedIssue.assignedTo || 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="flex-1 p-5 pb-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Discussion</h3>
                                    <div className="h-px flex-1 bg-white/[0.04] ml-4" />
                                </div>

                                {selectedIssue.comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                                        <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-xs">No comments yet. Start the discussion.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {selectedIssue.comments.map(c => (
                                            <CommentItem key={c.id} comment={c} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-2 space-y-2"
                        >
                            {issues.map(issue => (
                                <button
                                    key={issue.id}
                                    onClick={() => setSelectedIssueId(issue.id)}
                                    className="w-full text-left group relative p-4 rounded-xl border border-white/[0.04] bg-[#111114] hover:bg-[#16161a] hover:border-white/[0.08] transition-all duration-200"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[13px] font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-1 pr-8">
                                            {issue.title}
                                        </h4>
                                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${issue.priority === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                                issue.priority === 'high' ? 'bg-orange-500' :
                                                    'bg-blue-500'
                                            }`} />
                                    </div>
                                    <p className="text-[12px] text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                                        {issue.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-zinc-600 bg-white/[0.02] px-1.5 py-0.5 rounded">
                                            {issue.linkedEntityName}
                                        </span>
                                        <span className="text-[10px] text-zinc-600">
                                            {new Date(issue.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Footer */}
            {selectedIssue && (
                <div className="p-4 bg-[#0a0a0c] border-t border-white/[0.04] relative z-20">
                    {replyToId && (
                        <div className="flex items-center justify-between text-[11px] text-indigo-400 mb-2 px-2">
                            <span>Replying to comment...</span>
                            <button onClick={() => setReplyToId(null)} className="hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendComment} className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                className="w-full pl-4 pr-10 py-2.5 text-sm bg-[#16161a] border border-white/[0.06] rounded-lg focus:outline-none focus:border-indigo-500/40 focus:bg-[#1a1a1e] text-zinc-200 placeholder-zinc-600 transition-all shadow-inner"
                                placeholder={replyToId ? "Write a reply..." : "Discuss this issue..."}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {/* Optional: Add attachment button later */}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="p-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </aside>
    );
}

