import React from 'react';
import ReactMarkdown from 'react-markdown';

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
      <ReactMarkdown
        components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 space-y-1 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 space-y-1 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="pl-1" {...props} />,
            table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-200 border" {...props} /></div>,
            th: ({node, ...props}) => <th className="bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" {...props} />,
            td: ({node, ...props}) => <td className="px-3 py-2 whitespace-normal text-sm text-gray-700 border-b" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
