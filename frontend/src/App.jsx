import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import SharedView from "./pages/SharedView";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tweets" element={<CategoryPage type="tweet" title="Tweets" />} />
          <Route path="/videos" element={<CategoryPage type="video" title="Videos" />} />
          <Route path="/documents" element={<CategoryPage type="document" title="Documents" />} />
          <Route path="/links" element={<CategoryPage type="link" title="Links" />} />
          <Route path="/tags" element={<TagPage />} />
          <Route path="/tags/:tag" element={<CategoryPage title="Tagged Content" />} />
          <Route path="/shared/:shareLink" element={<SharedView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;