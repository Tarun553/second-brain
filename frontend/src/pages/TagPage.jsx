import { useEffect, useState } from 'react';
import { getContents } from '../api/content';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTags = async () => {
      if (!token) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const contents = await getContents(token);
        
        // Extract all tags and count their occurrences
        const tagCounts = {};
        
        contents.forEach((content) => {
          if (content.tags && content.tags.length > 0) {
            content.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });
        
        // Convert to array and sort by count (descending)
        const tagArray = Object.entries(tagCounts).map(([name, count]) => ({
          name,
          count,
        }));
        
        tagArray.sort((a, b) => b.count - a.count);
        
        setTags(tagArray);
      } catch (error) {
        setError('Failed to load tags. Please try again.');
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [token]);

  const getTagSize = (count) => {
    const max = Math.max(...tags.map(t => t.count));
    const min = Math.min(...tags.map(t => t.count));
    
    // Normalize to a range between 0 and 1
    const normalized = max === min ? 0.5 : (count - min) / (max - min);
    
    // Map to font sizes between 0.75rem and 2rem
    const minSize = 0.75;
    const maxSize = 2;
    const fontSize = minSize + normalized * (maxSize - minSize);
    
    return `${fontSize}rem`;
  };

  return (
    <MainLayout>
      <div>
        <div className="mb-6 flex items-center">
          <Hash className="mr-2 h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Hash className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add tags to your content to organize your second brain.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap gap-4">
              {tags.map(tag => (
                <Link
                  key={tag.name}
                  to={`/tags/${tag.name}`}
                  style={{ fontSize: getTagSize(tag.count) }}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                >
                  #{tag.name} <span className="text-gray-500 text-xs">({tag.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TagsPage;