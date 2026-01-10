'use client';

import React, { useState, useEffect } from 'react';
import { useIssues, IssueType, IssuePriority } from '@/context/IssueContext';

export default function IssueModal() {
    const { isModalOpen, closeCreateModal, createIssue, activeEntity } = useIssues();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<IssueType>('bug');
    const [priority, setPriority] = useState<IssuePriority>('medium');
    const [assignee, setAssignee] = useState('Unassigned');

    // Reset form when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setTitle('');
            setDescription('');
            setType('bug');
            setPriority('medium');
            setAssignee('Unassigned');
        }
    }, [isModalOpen]);

    if (!isModalOpen || !activeEntity) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createIssue({
            title,
            description,
            type,
            priority,
            linkedEntityId: activeEntity.id,
            linkedEntityName: activeEntity.name,
            assignedTo: assignee
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeCreateModal}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Report Issue</h3>
                    <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm flex items-center">
                        <span className="font-semibold mr-2">Linked Entity:</span> {activeEntity.name}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="E.g., High Latency on payment"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Describe the issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                value={type}
                                onChange={(e) => setType(e.target.value as IssueType)}
                            >
                                <option value="bug">Bug</option>
                                <option value="architecture">Architecture Violation</option>
                                <option value="security">Security Risk</option>
                                <option value="improvement">Improvement</option>
                                <option value="question">Question</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        >
                            <option value="Unassigned">Unassigned</option>
                            <option value="Me">Assign to Me</option>
                            <option value="Team Backend">Team Backend</option>
                            <option value="Team Frontend">Team Frontend</option>
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 from-neutral-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            Create Issue
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
