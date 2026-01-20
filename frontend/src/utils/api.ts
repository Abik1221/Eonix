
// API CONFIGURATION
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface IngestResponse {
    project_id: string;
    status: string;
}

export interface ProjectStats {
    [key: string]: number;
}

export interface GraphData {
    nodes: Array<{
        id: string;
        label: string;
        group: string;
        color?: string;
        [key: string]: any;
    }>;
    edges: Array<{
        from: string;
        to: string;
        label: string;
        arrows?: string;
        [key: string]: any;
    }>;
}

// API CLIENT
export const api = {
    /**
     * Submit a repository for ingestion
     */
    ingestRepo: async (repoUrl: string): Promise<IngestResponse> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/repos/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repo_url: repoUrl }),
        });

        if (!res.ok) throw new Error('Ingestion failed');
        return res.json();
    },

    /**
     * Get project statistics
     */
    getStats: async (projectId: string): Promise<ProjectStats> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/repos/${projectId}/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    /**
     * Get graph data for visualization
     */
    getGraph: async (projectId: string): Promise<GraphData> => {
        const res = await fetch(`${API_BASE_URL}/api/v1/repos/${projectId}/graph`);
        if (!res.ok) throw new Error('Failed to fetch graph');
        return res.json();
    },

    /**
     * Search public GitHub repositories
     */
    searchGithub: async (query: string): Promise<Array<{ full_name: string; description: string; clone_url: string; stargazers_count: number }>> => {
        if (!query) return [];
        try {
            const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
            if (!res.ok) return [];
            const data = await res.json();
            return data.items || [];
        } catch (e) {
            console.error("GitHub search failed", e);
            return [];
        }
    }
};
