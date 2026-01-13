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
    User,
    Clock,
    Tag
} from 'lucide-react';
import '../dashboard/dashboard.css';

export default function IssueSidebar() {
    const { issues, addComment, updateIssueStatus } = useIssues();
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyToId, setReplyToId] = useState<string | null>(null);

    const selectedIssue = issues.find(i => i.id === selectedIssueId);

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIssueId || !commentText.trim()) return;

        addComment(selectedIssueId, commentText, replyToId || undefined);
        setCommentText('');
        setReplyToId(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        // Simplified for detail view
        const label = status.replace('_', ' ');
        return <div className="detail-badge type">{label}</div>;
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`group ${isReply ? 'ml-8 mt-4' : 'mt-6'}`}>
            <div className="timeline-meta mb-2">
                <div className="meta-author">
                    <div className="author-avatar">{comment.author.charAt(0)}</div>
                    <span className="font-semibold text-zinc-300">{comment.author}</span>
                </div>
                <span>{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors" />
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {comment.content}
                </p>
            </div>

            <div className="flex items-center gap-4 mt-2 pl-6">
                <button
                    onClick={() => setReplyToId(comment.id)}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:text-indigo-400 transition-colors flex items-center gap-1"
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
    );

    return (
        <div className="flex flex-col h-full font-sans">
            {/* Header */}
            <div className="panel-header">
                {selectedIssue ? (
                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={() => setSelectedIssueId(null)}
                            className="p-1.5 -ml-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Issue Details</span>
                        </div>
                    </div>
                ) : (
                    <div className="panel-title">
                        <AlertCircle className="w-4 h-4 text-indigo-500" />
                        <span>Detected Issues</span>
                        <div className="issue-count-badge">
                            {issues.length}
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="panel-content custom-scrollbar">
                <AnimatePresence mode="wait">
                    {selectedIssue ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-full flex flex-col"
                        >
                            <div className="detail-header">
                                <div className="detail-badges">
                                    <div className={`detail-badge ${selectedIssue.priority}`}>
                                        {selectedIssue.priority} Priority
                                    </div>
                                    <div className="detail-badge type">
                                        {selectedIssue.type}
                                    </div>
                                </div>
                                <h1 className="detail-title">{selectedIssue.title}</h1>
                                <p className="detail-desc">{selectedIssue.description}</p>

                                <div className="info-grid">
                                    <div className="info-box">
                                        <div className="info-label">Impacted Service</div>
                                        <div className="info-value">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
                                            {selectedIssue.linkedEntityName}
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <div className="info-label">Assigned To</div>
                                        <div className="info-value">
                                            <User className="w-3 h-3 text-zinc-500" />
                                            {selectedIssue.assignedTo || 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="flex-1 p-6 pb-24">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Activity Log</h3>

                                {selectedIssue.comments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                        <MessageSquare className="w-10 h-10 mb-3" />
                                        <p className="text-xs font-medium">No activity yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
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
                            className="p-5 space-y-4"
                        >
                            {issues.map(issue => (
                                <div
                                    key={issue.id}
                                    onClick={() => setSelectedIssueId(issue.id)}
                                    className={`issue-card ${issue.priority}`}
                                >
                                    <div className="issue-header">
                                        <span className="issue-title">{issue.title}</span>
                                        <div className={`issue-priority-dot dot-${issue.priority}`} />
                                    </div>
                                    <p className="issue-desc">
                                        {issue.description}
                                    </p>
                                    <div className="issue-footer">
                                        <span className="issue-tag">{issue.linkedEntityName}</span>
                                        <span className="issue-date">
                                            {new Date(issue.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Footer */}
            {selectedIssue && (
                <div className="p-4 bg-[#0a0a0c] border-t border-white/[0.06] relative z-20 backdrop-blur-md">
                    {replyToId && (
                        <div className="flex items-center justify-between text-[10px] text-indigo-400 mb-2 px-2 uppercase tracking-wide font-bold">
                            <span>Replying...</span>
                            <button onClick={() => setReplyToId(null)} className="hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendComment} className="relative flex items-center gap-2">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                className="w-full pl-4 pr-10 py-3 text-xs bg-[#16161a] border border-white/[0.06] rounded-xl focus:outline-none focus:border-indigo-500/40 focus:bg-[#1a1a1e] text-zinc-200 placeholder-zinc-600 transition-all"
                                placeholder={replyToId ? "Write a reply..." : "Add a comment..."}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="p-3 bg-indigo-600 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
