'use client';

import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { FiSend } from 'react-icons/fi';
import { useCollaboration, TeamMember } from '@/context/CollaborationContext';
import './collaboration.css';

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (content: string, mentions: TeamMember[]) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function MentionInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Add a comment... Use @ to mention',
    autoFocus = false,
}: MentionInputProps) {
    const { teamMembers } = useCollaboration();
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [mentionIndex, setMentionIndex] = useState(0);
    const [mentions, setMentions] = useState<TeamMember[]>([]);
    const [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter members based on search
    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(mentionSearch.toLowerCase())
    );

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const position = e.target.selectionStart || 0;
        setCursorPosition(position);
        onChange(newValue);

        // Check for @ trigger
        const textBeforeCursor = newValue.slice(0, position);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1) {
            const textAfterAt = textBeforeCursor.slice(atIndex + 1);
            // Only show dropdown if @ is not followed by a space that would close it
            if (!textAfterAt.includes(' ') && atIndex === textBeforeCursor.length - 1 - textAfterAt.length) {
                setShowMentionDropdown(true);
                setMentionSearch(textAfterAt);
                setMentionIndex(0);
            } else if (textAfterAt.includes(' ')) {
                setShowMentionDropdown(false);
            }
        } else {
            setShowMentionDropdown(false);
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (showMentionDropdown) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev =>
                    prev < filteredMembers.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => prev > 0 ? prev - 1 : 0);
            } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (filteredMembers[mentionIndex]) {
                    selectMention(filteredMembers[mentionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowMentionDropdown(false);
            }
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Select a mention
    const selectMention = useCallback((member: TeamMember) => {
        const textBeforeCursor = value.slice(0, cursorPosition);
        const atIndex = textBeforeCursor.lastIndexOf('@');
        const textAfterCursor = value.slice(cursorPosition);

        const newValue =
            value.slice(0, atIndex) +
            `@${member.name} ` +
            textAfterCursor;

        onChange(newValue);
        setMentions(prev => [...prev.filter(m => m.id !== member.id), member]);
        setShowMentionDropdown(false);
        setMentionSearch('');

        // Focus back to input
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newPosition = atIndex + member.name.length + 2;
                inputRef.current.setSelectionRange(newPosition, newPosition);
            }
        }, 0);
    }, [value, cursorPosition, onChange]);

    // Handle submit
    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value, mentions);
            onChange('');
            setMentions([]);
        }
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowMentionDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll selected item into view
    useEffect(() => {
        if (showMentionDropdown && dropdownRef.current) {
            const selected = dropdownRef.current.querySelector('.mention-item.selected');
            if (selected) {
                selected.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [mentionIndex, showMentionDropdown]);

    return (
        <div className="mention-input-container">
            <div className="mention-input-wrapper">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    rows={1}
                    className="mention-textarea"
                />
                <button
                    onClick={handleSubmit}
                    className="mention-submit-btn"
                    disabled={!value.trim()}
                >
                    <FiSend />
                </button>
            </div>

            {/* Mention Dropdown */}
            {showMentionDropdown && filteredMembers.length > 0 && (
                <div ref={dropdownRef} className="mention-dropdown">
                    <div className="mention-dropdown-header">Team Members</div>
                    {filteredMembers.map((member, index) => (
                        <div
                            key={member.id}
                            className={`mention-item ${index === mentionIndex ? 'selected' : ''}`}
                            onClick={() => selectMention(member)}
                        >
                            <div className="mention-avatar">{member.initials}</div>
                            <div className="mention-info">
                                <span className="mention-name">{member.name}</span>
                                <span className="mention-email">{member.email}</span>
                            </div>
                            <span className={`mention-role ${member.role}`}>{member.role}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Mentioned Users Pills */}
            {mentions.length > 0 && (
                <div className="mention-pills">
                    {mentions.map(member => (
                        <span key={member.id} className="mention-pill">
                            @{member.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
