'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLink, FiCheck, FiUserPlus, FiChevronDown } from 'react-icons/fi';
import { useCollaboration } from '@/context/CollaborationContext';
import './collaboration.css';

interface TeamInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type InviteRole = 'viewer' | 'editor' | 'admin';

interface InviteEntry {
    email: string;
    role: InviteRole;
}

export default function TeamInviteModal({ isOpen, onClose }: TeamInviteModalProps) {
    const { generateInviteLink, inviteLink } = useCollaboration();
    const [invites, setInvites] = useState<InviteEntry[]>([{ email: '', role: 'viewer' }]);
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // Handle email input change
    const handleEmailChange = (index: number, email: string) => {
        setInvites(prev => prev.map((invite, i) =>
            i === index ? { ...invite, email } : invite
        ));
    };

    // Handle role change
    const handleRoleChange = (index: number, role: InviteRole) => {
        setInvites(prev => prev.map((invite, i) =>
            i === index ? { ...invite, role } : invite
        ));
    };

    // Add another email field
    const addEmailField = () => {
        setInvites(prev => [...prev, { email: '', role: 'viewer' }]);
    };

    // Remove email field
    const removeEmailField = (index: number) => {
        if (invites.length > 1) {
            setInvites(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Copy invite link
    const handleCopyLink = useCallback(() => {
        const link = inviteLink || generateInviteLink();
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [inviteLink, generateInviteLink]);

    // Send invites
    const handleSendInvites = async () => {
        const validEmails = invites.filter(inv => isValidEmail(inv.email));
        if (validEmails.length === 0) return;

        setSending(true);

        // Simulate API call - in real app, this would call your backend
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Prepare webhook payload for the invites
        const webhookPayload = {
            type: 'team_invite',
            invites: validEmails,
            timestamp: new Date().toISOString(),
        };
        console.log('Webhook payload ready:', webhookPayload);

        setSending(false);
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setInvites([{ email: '', role: 'viewer' }]);
            onClose();
        }, 1500);
    };

    // Email validation
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const hasValidEmails = invites.some(inv => isValidEmail(inv.email));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Click overlay to close */}
                    <div
                        style={{ position: 'absolute', inset: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="invite-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="invite-modal-header">
                            <div className="invite-modal-title">
                                <FiUserPlus className="title-icon" />
                                <h2>Invite Team Members</h2>
                            </div>
                            <button className="modal-close-btn" onClick={onClose}>
                                <FiX />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="invite-modal-content">
                            {/* Email Inputs */}
                            <div className="invite-emails">
                                <label className="input-label">Email addresses</label>
                                {invites.map((invite, index) => (
                                    <div key={index} className="invite-row">
                                        <div className="invite-email-input">
                                            <FiMail className="input-icon" />
                                            <input
                                                type="email"
                                                value={invite.email}
                                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                                placeholder="colleague@company.com"
                                                className={`email-input ${invite.email && !isValidEmail(invite.email) ? 'invalid' : ''}`}
                                            />
                                        </div>
                                        <div className="role-select-wrapper">
                                            <select
                                                value={invite.role}
                                                onChange={(e) => handleRoleChange(index, e.target.value as InviteRole)}
                                                className="role-select"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <FiChevronDown className="select-icon" />
                                        </div>
                                        {invites.length > 1 && (
                                            <button
                                                className="remove-email-btn"
                                                onClick={() => removeEmailField(index)}
                                            >
                                                <FiX />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="add-email-btn" onClick={addEmailField}>
                                    + Add another
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="invite-divider">
                                <span>or</span>
                            </div>

                            {/* Copy Link Section */}
                            <div className="invite-link-section">
                                <label className="input-label">Share invite link</label>
                                <div className="invite-link-row">
                                    <div className="invite-link-display">
                                        <FiLink className="input-icon" />
                                        <span className="link-text">
                                            {inviteLink || 'Click to generate link'}
                                        </span>
                                    </div>
                                    <button
                                        className={`copy-link-btn ${copied ? 'copied' : ''}`}
                                        onClick={handleCopyLink}
                                    >
                                        {copied ? (
                                            <>
                                                <FiCheck /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <FiLink /> Copy Link
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="link-note">
                                    Anyone with this link can join as a Viewer
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="invite-modal-footer">
                            <button className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                className={`send-btn ${sent ? 'sent' : ''}`}
                                onClick={handleSendInvites}
                                disabled={!hasValidEmails || sending || sent}
                            >
                                {sent ? (
                                    <>
                                        <FiCheck /> Sent!
                                    </>
                                ) : sending ? (
                                    <span className="sending-spinner" />
                                ) : (
                                    <>
                                        <FiMail /> Send Invites
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
