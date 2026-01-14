'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    initials: string;
    role: 'admin' | 'editor' | 'viewer';
}

export interface Comment {
    id: string;
    content: string;
    author: TeamMember;
    position: { x: number; y: number };
    mentions: TeamMember[];
    createdAt: Date;
    replies: Reply[];
    resolved: boolean;
}

export interface Reply {
    id: string;
    content: string;
    author: TeamMember;
    mentions: TeamMember[];
    createdAt: Date;
}

export interface WebhookPayload {
    type: 'comment_created' | 'comment_replied' | 'mention_notification';
    comment: Comment;
    mentionedUsers: TeamMember[];
    timestamp: Date;
}

// Mock team members
const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { id: '1', name: 'Nahom Keneni', email: 'nahom@eonix.io', initials: 'NK', role: 'admin' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@eonix.io', initials: 'SC', role: 'editor' },
    { id: '3', name: 'Marcus Johnson', email: 'marcus@eonix.io', initials: 'MJ', role: 'editor' },
    { id: '4', name: 'Elena Rodriguez', email: 'elena@eonix.io', initials: 'ER', role: 'viewer' },
    { id: '5', name: 'David Park', email: 'david@eonix.io', initials: 'DP', role: 'viewer' },
];

interface CollaborationContextType {
    // Team Members
    teamMembers: TeamMember[];
    currentUser: TeamMember;

    // Comments
    comments: Comment[];
    activeCommentId: string | null;
    isAddingComment: boolean;

    // Actions
    addComment: (position: { x: number; y: number }, content: string, mentions: TeamMember[]) => void;
    addReply: (commentId: string, content: string, mentions: TeamMember[]) => void;
    setActiveComment: (id: string | null) => void;
    toggleAddingComment: () => void;
    resolveComment: (id: string) => void;
    deleteComment: (id: string) => void;

    // Webhook
    prepareWebhookPayload: (comment: Comment) => WebhookPayload;
    pendingWebhooks: WebhookPayload[];
    clearPendingWebhooks: () => void;

    // Invite
    inviteLink: string;
    generateInviteLink: () => string;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
    const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
    const [currentUser] = useState<TeamMember>(MOCK_TEAM_MEMBERS[0]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [pendingWebhooks, setPendingWebhooks] = useState<WebhookPayload[]>([]);
    const [inviteLink, setInviteLink] = useState('');

    const generateInviteLink = useCallback(() => {
        const link = `https://app.eonix.io/invite/${Math.random().toString(36).substring(2, 15)}`;
        setInviteLink(link);
        return link;
    }, []);

    const prepareWebhookPayload = useCallback((comment: Comment): WebhookPayload => {
        return {
            type: comment.mentions.length > 0 ? 'mention_notification' : 'comment_created',
            comment,
            mentionedUsers: comment.mentions,
            timestamp: new Date(),
        };
    }, []);

    const addComment = useCallback((
        position: { x: number; y: number },
        content: string,
        mentions: TeamMember[]
    ) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            content,
            author: currentUser,
            position,
            mentions,
            createdAt: new Date(),
            replies: [],
            resolved: false,
        };

        setComments(prev => [...prev, newComment]);
        setIsAddingComment(false);
        setActiveCommentId(newComment.id);

        // Prepare webhook payload
        if (mentions.length > 0) {
            const payload = prepareWebhookPayload(newComment);
            setPendingWebhooks(prev => [...prev, payload]);
        }
    }, [currentUser, prepareWebhookPayload]);

    const addReply = useCallback((
        commentId: string,
        content: string,
        mentions: TeamMember[]
    ) => {
        const newReply: Reply = {
            id: `reply-${Date.now()}`,
            content,
            author: currentUser,
            mentions,
            createdAt: new Date(),
        };

        setComments(prev => prev.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
        }));

        // Prepare webhook for reply with mentions
        if (mentions.length > 0) {
            const comment = comments.find(c => c.id === commentId);
            if (comment) {
                const payload: WebhookPayload = {
                    type: 'comment_replied',
                    comment: { ...comment, replies: [...comment.replies, newReply] },
                    mentionedUsers: mentions,
                    timestamp: new Date(),
                };
                setPendingWebhooks(prev => [...prev, payload]);
            }
        }
    }, [currentUser, comments]);

    const setActiveComment = useCallback((id: string | null) => {
        setActiveCommentId(id);
    }, []);

    const toggleAddingComment = useCallback(() => {
        setIsAddingComment(prev => !prev);
        if (!isAddingComment) {
            setActiveCommentId(null);
        }
    }, [isAddingComment]);

    const resolveComment = useCallback((id: string) => {
        setComments(prev => prev.map(comment => {
            if (comment.id === id) {
                return { ...comment, resolved: true };
            }
            return comment;
        }));
    }, []);

    const deleteComment = useCallback((id: string) => {
        setComments(prev => prev.filter(comment => comment.id !== id));
        if (activeCommentId === id) {
            setActiveCommentId(null);
        }
    }, [activeCommentId]);

    const clearPendingWebhooks = useCallback(() => {
        setPendingWebhooks([]);
    }, []);

    return (
        <CollaborationContext.Provider
            value={{
                teamMembers,
                currentUser,
                comments,
                activeCommentId,
                isAddingComment,
                addComment,
                addReply,
                setActiveComment,
                toggleAddingComment,
                resolveComment,
                deleteComment,
                prepareWebhookPayload,
                pendingWebhooks,
                clearPendingWebhooks,
                inviteLink,
                generateInviteLink,
            }}
        >
            {children}
        </CollaborationContext.Provider>
    );
}

export function useCollaboration() {
    const context = useContext(CollaborationContext);
    if (context === undefined) {
        throw new Error('useCollaboration must be used within a CollaborationProvider');
    }
    return context;
}
