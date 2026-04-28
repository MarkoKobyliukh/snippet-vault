'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSnippet, updateSnippet, deleteSnippet } from '@/lib/api';
import { Snippet } from '@/lib/types';
import SnippetForm from '@/components/SnippetForm';

const TYPE_COLORS = {
  link: 'bg-blue-100 text-blue-700',
  note: 'bg-green-100 text-green-700',
  command: 'bg-orange-100 text-orange-700',
};

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSnippet(id)
      .then(setSnippet)
      .catch(() => setError('Snippet not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(data: Parameters<typeof updateSnippet>[1]) {
    if (!snippet) return;
    const updated = await updateSnippet(snippet._id, data);
    setSnippet(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!snippet) return;
    setDeleting(true);
    try {
      await deleteSnippet(snippet._id);
      router.push('/');
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 text-sm">{error || 'Snippet not found.'}</p>
        <Link href="/" className="text-blue-600 text-sm hover:underline">← Back to list</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          ← Back to snippets
        </Link>

        {editing ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Edit Snippet</h2>
            <SnippetForm
              initial={snippet}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              submitLabel="Save Changes"
            />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-xl font-bold text-gray-900">{snippet.title}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${TYPE_COLORS[snippet.type]}`}>
                {snippet.type}
              </span>
            </div>

            <pre className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap break-all mb-4">
              {snippet.content}
            </pre>

            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {snippet.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mb-6">
              Created {new Date(snippet.createdAt).toLocaleDateString()} ·{' '}
              Updated {new Date(snippet.updatedAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
