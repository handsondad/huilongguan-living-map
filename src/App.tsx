import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { StoryPage } from './pages/StoryPage';
import { ThemeDetailPage } from './pages/ThemeDetailPage';
import { ThemesPage } from './pages/ThemesPage';

export function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="map" element={<MapPage />} /><Route path="themes" element={<ThemesPage />} /><Route path="themes/:themeId" element={<ThemeDetailPage />} /><Route path="guide" element={<GuidePage />} /><Route path="stories/yunquyuan-3" element={<StoryPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>;
}
