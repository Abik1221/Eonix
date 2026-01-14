'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiCheck, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { useCollaboration, Comment, TeamMember } from '@/context/CollaborationContext';
import MentionInput from './MentionInput';
import './collaboration.css';

interface CommentingSystemProps {
    canvasRef?: React.RefObject<HTMLDivElement>;
}

export default function CommentingSystem({ canvasRef }: CommentingSystemProps) {
    const {
        comments,
        activeCommentId,
        isAddingComment,
        addComment,
        addReply,
        setActiveComment,
        resolveComment,
        deleteComment,
        currentUser,
    } = useCollaboration();

    const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(null);
    const [commentInput, setCommentInput] = useState('');
    const [replyInput, setReplyInput] = useState('');
    const [showMenu, setShowMenu] = useState<string | null>(null);

    // Handle canvas click for new comment
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isAddingComment) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setNewCommentPosition({ x, y });
        setActiveComment(null);
    }, [isAddingComment, setActiveComment]);

    // Submit new comment
    const handleSubmitComment = (content: string, mentions: TeamMember[]) => {
        if (newCommentPosition) {
            addComment(newCommentPosition, content, mentions);
            setNewCommentPosition(null);
            setCommentInput('');
        }
    };

    // Submit reply
    const handleSubmitReply = (commentId: string) => (content: string, mentions: TeamMember[]) => {
        addReply(commentId, content, mentions);
        setReplyInput('');
    };

    // Format timestamp
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    // Get active comment
    const activeComment = comments.find(c => c.id === activeCommentId);

    return (
        <>
            {/* Comment Overlay for Canvas Click */}
            {isAddingComment && (
                <div
                    className="comment-overlay"
                    onClick={handleCanvasClick}
                >
                    <div className="comment-overlay-hint">
                        <FiMessageCircle />
                        <span>Click anywhere to add a comment</span>
                    </div>
                </div>
            )}

            {/* Comment Pins */}
            {comments.map(comment => (
                <motion.div
                    key={comment.id}
                    className={`comment-pin ${comment.resolved ? 'resolved' : ''} ${activeCommentId === comment.id ? 'active' : ''}`}
                    style={{
                        left: `${comment.position.x}%`,
                        top: `${comment.position.y}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveComment(comment.id);
                    }}
                >
                    <div className="pin-avatar">{comment.author.initials}</div>
                    {comment.replies.length > 0 && (
                        <span className="pin-count">{comment.replies.length + 1}</span>
                    )}
                </motion.div>
            ))}

            {/* New Comment Input */}
            <AnimatePresence>
                {newCommentPosition && (
                    <motion.div
                        className="comment-input-popup"
                        style={{
                            left: `${newCommentPosition.x}%`,
                            top: `${newCommentPosition.y}%`,
                        }}
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="comment-input-header">
                            <div className="comment-author">
                                <div className="author-avatar">{currentUser.initials}</div>
                                <span>{currentUser.name}</span>
                            </div>
                            <button
                                className="close-btn"
                                onClick={() => setNewCommentPosition(null)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <MentionInput
                            value={commentInput}
                            onChange={setCommentInput}
                            onSubmit={handleSubmitComment}
                            placeholder="Leave a comment..."
                            autoFocus
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comment Thread Panel */}
            <AnimatePresence>
                {activeComment && (
                    <motion.div
                        className="comment-thread-panel"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="thread-header">
                            <h3>Comment Thread</h3>
                            <div className="thread-actions">
                                <button
                                    className="thread-menu-btn"
                                    onClick={() => setShowMenu(showMenu === activeComment.id ? null : activeComment.id)}
                                >
                                    <FiMoreHorizontal />
                                </button>
                                {showMenu === activeComment.id && (
                                    <div className="thread-menu">
                                        <button onClick={() => {
                                            resolveComment(activeComment.id);
                                            setShowMenu(null);
                                        }}>
                                            <FiCheck /> Resolve
                                        </button>
                                        <button
                                            className="danger"
                                            onClick={() => {
                                                deleteComment(activeComment.id);
                                                setShowMenu(null);
                                            }}
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                )}
                                <button
                                    className="close-thread-btn"
                                    onClick={() => setActiveComment(null)}
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        <div className="thread-messages">
                            {/* Original Comment */}
                            <div className="thread-message original">
                                <div className="message-avatar">{activeComment.author.initials}</div>
                                <div className="message-content">
                                    <div className="message-meta">
                                        <span className="author-name">{activeComment.author.name}</span>
                                        <span className="message-time">{formatTime(activeComment.createdAt)}</span>
                                    </div>
                                    <p className="message-text">{activeComment.content}</p>
                                    {activeComment.mentions.length > 0 && (
                                        <div className="message-mentions">
                                            {activeComment.mentions.map(m => (
                                                <span key={m.id} className="mention-tag">@{m.name}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Replies */}
                            {activeComment.replies.map(reply => (
                                <div key={reply.id} className="thread-message reply">
                                    <div className="message-avatar">{reply.author.initials}</div>
                                    <div className="message-content">
                                        <div className="message-meta">
                                            <span className="author-name">{reply.author.name}</span>
                                            <span className="message-time">{formatTime(reply.createdAt)}</span>
                                        </div>
                                        <p className="message-text">{reply.content}</p>
                                        {reply.mentions.length > 0 && (
                                            <div className="message-mentions">
                                                {reply.mentions.map(m => (
                                                    <span key={m.id} className="mention-tag">@{m.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Input */}
                        <div className="thread-reply-input">
                            <MentionInput
                                value={replyInput}
                                onChange={setReplyInput}
                                onSubmit={handleSubmitReply(activeComment.id)}
                                placeholder="Reply..."
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
