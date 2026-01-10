'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import VisualizationLayout from '@/components/dashboard/VisualizationLayout';

export default function DashboardPage() {
    const params = useParams();
    const projectId = params.id as string;

    return (
        <div className="h-screen w-full overflow-hidden">
            <VisualizationLayout projectId={projectId} />
        </div>
    );
}
