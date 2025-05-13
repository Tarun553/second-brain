import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedContent } from '../api/content';
import ContentCard from '../components/content/ContentCard';
import MainLayout from '../components/layout/MainLayout';
import { Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SharedView = () => {
  const { shareLink } = useParams();
  const [sharedContent, setSharedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!shareLink || !token) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getSharedContent(shareLink, token);
        setSharedContent(data);
      } catch (error) {
        setError('Failed to load shared content. The link may be invalid or expired.');
        console.error('Error fetching shared content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareLink, token]);

  // Dummy function for delete - we don't actually allow deleting in shared view
  const handleDeleteContent = () => {
    console.log('Delete not available in shared view');
  };

  return (
    <MainLayout requireAuth={false}>
      <div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : sharedContent ? (
          <div>
            <div className="mb-6 flex items-center">
              <Brain className="mr-2 h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {sharedContent.username}'s Brain
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedContent.content.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onDelete={handleDeleteContent}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p>No shared content found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SharedView;