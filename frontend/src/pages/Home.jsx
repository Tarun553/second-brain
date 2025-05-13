import ContentList from '../components/content/ContentList';
import MainLayout from '../components/layout/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <ContentList title="All Notes" />
    </MainLayout>
  );
};

export default Home;