import ContentList from '../components/content/ContentList';
import MainLayout from '../components/layout/MainLayout';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { tag } = useParams();
  
  return (
    <MainLayout>
      <ContentList
        contentType={tag}
        title={tag ? `#${tag}` : 'All Notes'}
        tagFilter={tag}
      />
    </MainLayout>
  );
};

export default CategoryPage;