'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type IssueType = 'bug' | 'architecture' | 'security' | 'improvement' | 'question';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'in_progress' | 'blocked' | 'done';

export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    type: IssueType;
    priority: IssuePriority;
    status: IssueStatus;
    linkedEntityId: string; // ID of the service/node
    linkedEntityName: string;
    assignedTo?: string;
    comments: Comment[];
    createdAt: string;
}

interface IssueContextType {
    issues: Issue[];
    isModalOpen: boolean;
    activeEntity: { id: string; name: string } | null;
    createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'comments' | 'status'>) => void;
    updateIssueStatus: (issueId: string, status: IssueStatus) => void;
    addComment: (issueId: string, content: string) => void;
    openCreateModal: (entityId: string, entityName: string) => void;
    closeCreateModal: () => void;
    getIssuesForEntity: (entityId: string) => Issue[];
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_ISSUES: Issue[] = [
    {
        id: 'issue-1',
        title: 'Shared Database Violation',
        description: 'Auth Service and Payment Service are sharing the same primary-db. This creates a tight coupling and single point of failure.',
        type: 'architecture',
        priority: 'critical',
        status: 'open',
        linkedEntityId: 'auth',
        linkedEntityName: 'Auth Service',
        assignedTo: 'Team Backend',
        createdAt: new Date().toISOString(),
        comments: [
            { id: 'c1', author: 'AI Analyst', content: 'This violation increases blast radius by 40%.', timestamp: new Date().toISOString() }
        ]
    },
    {
        id: 'issue-2',
        title: 'High Latency on Login',
        description: 'Login endpoint exceeds 500ms p99 latency.',
        type: 'bug',
        priority: 'high',
        status: 'in_progress',
        linkedEntityId: 'auth',
        linkedEntityName: 'Auth Service',
        assignedTo: 'Jane Doe',
        createdAt: new Date().toISOString(),
        comments: []
    }
];

export function IssueProvider({ children }: { children: ReactNode }) {
    const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEntity, setActiveEntity] = useState<{ id: string; name: string } | null>(null);

    const createIssue = (data: Omit<Issue, 'id' | 'createdAt' | 'comments' | 'status'>) => {
        const newIssue: Issue = {
            ...data,
            id: `issue-${Date.now()}`,
            status: 'open',
            comments: [],
            createdAt: new Date().toISOString(),
        };
        setIssues((prev) => [newIssue, ...prev]);
        setIsModalOpen(false);
    };

    const updateIssueStatus = (issueId: string, status: IssueStatus) => {
        setIssues((prev) => prev.map(i => i.id === issueId ? { ...i, status } : i));
    };

    const addComment = (issueId: string, content: string) => {
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: 'You', // Mock User
            content,
            timestamp: new Date().toISOString(),
        };
        setIssues((prev) => prev.map(i =>
            i.id === issueId
                ? { ...i, comments: [...i.comments, newComment] }
                : i
        ));
    };

    const openCreateModal = (entityId: string, entityName: string) => {
        setActiveEntity({ id: entityId, name: entityName });
        setIsModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsModalOpen(false);
        setActiveEntity(null);
    };

    const getIssuesForEntity = (entityId: string) => {
        return issues.filter((i) => i.linkedEntityId === entityId);
    };

    return (
        <IssueContext.Provider value={{
            issues,
            isModalOpen,
            activeEntity,
            createIssue,
            updateIssueStatus,
            addComment,
            openCreateModal,
            closeCreateModal,
            getIssuesForEntity
        }}>
            {children}
        </IssueContext.Provider>
    );
}

export function useIssues() {
    const context = useContext(IssueContext);
    if (context === undefined) {
        throw new Error('useIssues must be used within an IssueProvider');
    }
    return context;
}
