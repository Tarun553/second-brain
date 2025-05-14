import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deleteContent, getContents, createContent } from '../../api/content';
import ContentCard from './ContentCard';
import ContentForm from './ContentForm';
import { Share as ShareLink, BrainCircuit } from 'lucide-react';

const ContentList = ({ contentType, title, tagFilter }) => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const token = authState?.token;

  useEffect(() => {
    console.log('ContentList mounted, authState:', authState);
    console.log('Token available:', token);
    
    if (token) {
      console.log('Calling fetchContents from useEffect');
      fetchContents();
    }
  }, []);

  useEffect(() => {
    console.log('Dependencies changed, token:', token);
    if (token) {
      fetchContents();
    }
  }, [token, contentType, tagFilter, setShareLink]);

  const fetchContents = async () => {
    if (!token) {
      console.log('No token available, cannot fetch contents');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching contents with token:', token);
      const data = await getContents(token);
      console.log('Received contents:', data);
      
      // Filter content based on type if specified
      let filteredData = data || [];
      if (data && contentType) {
        filteredData = data.filter((item) => item.type === contentType);
        console.log('Filtered by content type:', contentType, filteredData);
      }
      
      // Filter content based on tag if specified
      if (data && tagFilter) {
        filteredData = filteredData.filter((item) => 
          item.tags && item.tags.includes(tagFilter)
        );
        console.log('Filtered by tag:', tagFilter, filteredData);
      }
      
      setContents(filteredData);
    } catch (error) {
      console.error('Error in fetchContents:', error);
      setError('Failed to load content. Please try again.');
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContent = async (formData) => {
    if (!token) return;
    
    setIsFormLoading(true);
    setError(null);
    
    try {
      await createContent(formData, token);
      await fetchContents(); // Reload content after adding
    } catch (error) {
      setError('Failed to add content. Please try again.');
      console.error('Error adding content:', error);
      throw error;
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!token) return;
    
    try {
      await deleteContent(id, token);
      setContents(contents.filter(content => content._id !== id));
    } catch (error) {
      setError('Failed to delete content. Please try again.');
      console.error('Error deleting content:', error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <BrainCircuit className="mr-2 h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {/* Share button (placeholder for future functionality) */}
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <ShareLink size={18} className="mr-2" />
          Share Brain
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {shareLink && (
        <div className="mb-4 bg-green-50 p-4 rounded-md flex justify-between items-center">
          <p className="text-sm text-green-700">
            Your content is shared at: <span className="font-medium">{shareLink}</span>
          </p>
          <button 
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="text-green-700 hover:text-green-900 text-sm font-medium focus:outline-none"
          >
            Copy Link
          </button>
        </div>
      )}

      <ContentForm onSubmit={handleAddContent} isLoading={isFormLoading} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <BrainCircuit className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start adding content to build your second brain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map(content => (
            <ContentCard
              key={content._id}
              content={content}
              onDelete={handleDeleteContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentList;