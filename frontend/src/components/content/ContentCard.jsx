import { Trash2, Share2, Twitter, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ContentCard = ({ content, onDelete }) => {
  // Get the appropriate icon based on content type
  const getIcon = (type) => {
    switch (type) {
      case 'tweet':
        return <Twitter className="text-blue-400" />;
      case 'video':
        return <Video className="text-red-500" />;
      case 'document':
        return <FileText className="text-green-500" />;
      case 'link':
        return <LinkIcon className="text-purple-500" />;
      default:
        return null;
    }
  };

  // Format date if available
  const formattedDate = content.createdAt 
    ? formatDistanceToNow(new Date(content.createdAt), { addSuffix: true }) 
    : '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              {getIcon(content.type)}
            </div>
            <h3 className="font-medium text-gray-900 line-clamp-1">{content.title}</h3>
          </div>
          <div className="flex space-x-2">
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              aria-label="Share content"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(content._id)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-150"
              aria-label="Delete content"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <a 
          href={content.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mt-3 text-sm text-gray-600 hover:text-indigo-600 transition-colors break-all"
        >
          {content.link}
        </a>
        
        {content.tags && content.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {content.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {formattedDate && (
          <div className="mt-3 text-xs text-gray-500">
            Added {formattedDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;