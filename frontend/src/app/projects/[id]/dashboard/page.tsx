'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
    const params = useParams();
    const projectId = params.id as string;

    return (
        <DashboardLayout projectId={projectId} />
    );
}
