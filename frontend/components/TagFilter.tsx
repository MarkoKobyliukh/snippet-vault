'use client';

interface Props {
  tags: string[];
  active: string;
  onSelect: (tag: string) => void;
}

export default function TagFilter({ tags, active, onSelect }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`text-xs px-3 py-1 rounded-full transition-colors ${
          active === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            active === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
