import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ContentForm = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('link');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const contentTypes = [
    { value: 'tweet', label: 'Tweet' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'link', label: 'Link' },
  ];

  const handleTagAdd = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      title: title.trim(),
      link: link.trim(),
      type,
      tags,
    };
    
    // Validate form data
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.link.trim()) {
      setError('Link is required');
      return;
    }
    
    console.log('Submitting content:', formData);
    try {
      await onSubmit(formData);
      // Reset form on success
      setTitle('');
      setLink('');
      setType('link');
      setTags([]);
      setIsFormOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error submitting content:', error);
    }
  };

  return (
    <div className="mb-8">
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          Add Content
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Add New Content</h2>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 text-red-500">{error}</div>
            )}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {contentTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex">
                <input
                  id="tags"
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add tags..."
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="bg-gray-100 px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(t)}
                        className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContentForm;