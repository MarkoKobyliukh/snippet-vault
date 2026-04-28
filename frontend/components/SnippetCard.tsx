import Link from 'next/link';
import { Snippet } from '@/lib/types';

const TYPE_COLORS = {
  link: 'bg-blue-100 text-blue-700',
  note: 'bg-green-100 text-green-700',
  command: 'bg-orange-100 text-orange-700',
};

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Link href={`/snippets/${snippet._id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{snippet.title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[snippet.type]}`}>
            {snippet.type}
          </span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{snippet.content}</p>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {snippet.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
