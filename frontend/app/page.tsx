'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSnippets, createSnippet } from '@/lib/api';
import { Snippet } from '@/lib/types';
import SnippetCard from '@/components/SnippetCard';
import SnippetForm from '@/components/SnippetForm';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';

const LIMIT = 9;

export default function HomePage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSnippets({ q, tag, page, limit: LIMIT });
      setSnippets(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setError('Failed to load snippets. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [q, tag, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getSnippets({ limit: 100 }).then((res) => {
      const tags = Array.from(new Set(res.data.flatMap((s) => s.tags)));
      setAllTags(tags);
    }).catch(() => {});
  }, [snippets]);

  useEffect(() => {
    const t = setTimeout(() => { setQ(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function handleCreate(data: Parameters<typeof createSnippet>[0]) {
    await createSnippet(data);
    setShowForm(false);
    setPage(1);
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Snippet Vault</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} snippet{total !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Snippet'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">New Snippet</h2>
            <SnippetForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitLabel="Create Snippet" />
          </div>
        )}

        <div className="space-y-3 mb-5">
          <SearchBar value={search} onChange={setSearch} />
          <TagFilter tags={allTags} active={tag} onSelect={(t) => { setTag(t); setPage(1); }} />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && snippets.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">{q || tag ? 'No snippets match your search.' : 'No snippets yet. Create your first one!'}</p>
          </div>
        )}

        {!loading && !error && snippets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {snippets.map((s) => <SnippetCard key={s._id} snippet={s} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
