'use client';

import React, { useState } from 'react';
import { useIssues, Issue, IssuePriority } from '@/context/IssueContext';

export default function IssueSidebar() {
    const { issues, addComment, updateIssueStatus } = useIssues();
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    const selectedIssue = issues.find(i => i.id === selectedIssueId);

    const getPriorityColor = (p: IssuePriority) => {
        switch (p) {
            case 'critical': return 'text-red-700 bg-red-50 ring-1 ring-red-600/10';
            case 'high': return 'text-orange-700 bg-orange-50 ring-1 ring-orange-600/10';
            case 'medium': return 'text-amber-700 bg-amber-50 ring-1 ring-amber-600/10';
            default: return 'text-blue-700 bg-blue-50 ring-1 ring-blue-600/10';
        }
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIssueId || !commentText.trim()) return;
        addComment(selectedIssueId, commentText);
        setCommentText('');
    };

    return (
        <aside className="w-96 h-full bg-white border-l border-slate-200 flex flex-col shadow-xl shadow-slate-200/50 z-30 font-sans">

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-white shrinking-0">
                {selectedIssue ? (
                    <button
                        onClick={() => setSelectedIssueId(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back
                    </button>
                ) : (
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 leading-none mb-1">Detected Issues</h2>
                            <p className="text-[11px] text-slate-500 font-medium">Architectural risks & improvements</p>
                        </div>
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-full">
                            {issues.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-3">
                {selectedIssue ? (
                    // Detail View
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityColor(selectedIssue.priority)}`}>
                                    {selectedIssue.priority}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                                    {selectedIssue.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">{selectedIssue.title}</h3>
                            <p className="text-xs leading-relaxed text-slate-600 mb-4">{selectedIssue.description}</p>

                            <div className="space-y-3 pt-3 border-t border-slate-50">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Impacted Service</span>
                                    <div className="flex items-center gap-1.5 text-slate-900 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        {selectedIssue.linkedEntityName}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Assignee</span>
                                    <div className="flex items-center gap-1.5">
                                        {selectedIssue.assignedTo ? (
                                            <>
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                    {selectedIssue.assignedTo.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-900">{selectedIssue.assignedTo}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedIssue.status !== 'done' && (
                            <button
                                onClick={() => updateIssueStatus(selectedIssue.id, 'done')}
                                className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Mark as Resolved
                            </button>
                        )}

                        {/* Comments */}
                        <div className="pt-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Discussion</h4>
                            <div className="space-y-3 mb-4">
                                {selectedIssue.comments.length === 0 && (
                                    <div className="text-center py-6 bg-slate-50 rounded border border-dashed border-slate-200">
                                        <p className="text-[10px] text-slate-400">No comments yet.</p>
                                    </div>
                                )}
                                {selectedIssue.comments.map(c => (
                                    <div key={c.id} className="flex gap-2.5 group">
                                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 shadow-sm">
                                            {c.author.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                <span className="text-xs font-bold text-slate-900">{c.author}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg rounded-tl-none border border-slate-100 shadow-sm">
                                                {c.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // List View
                    <div className="space-y-2">
                        {issues.map(issue => (
                            <div
                                key={issue.id}
                                onClick={() => setSelectedIssueId(issue.id)}
                                className="group bg-white p-3 rounded-lg border border-slate-100 hover:border-indigo-500/30 hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-1.5 gap-3">
                                    <h4 className="text-[13px] font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {issue.title}
                                    </h4>
                                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${issue.priority === 'critical' ? 'bg-red-500' :
                                        issue.priority === 'high' ? 'bg-orange-500' :
                                            'bg-slate-300'
                                        }`} />
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                    {issue.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-slate-50 rounded text-[10px] font-medium text-slate-500 border border-slate-100/50">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        {issue.linkedEntityName}
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {new Date(issue.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Comment Input (Only in Detail View) */}
            {selectedIssue && (
                <div className="p-3 bg-white border-t border-slate-200">
                    <form onSubmit={handleSendComment} className="relative group">
                        <input
                            type="text"
                            className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 text-white rounded-md opacity-0 group-focus-within:opacity-100 disabled:opacity-0 hover:bg-indigo-700 transition-all shadow-sm"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            )}
        </aside>
    );
}
