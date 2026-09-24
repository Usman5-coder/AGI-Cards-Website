import { useEffect, useState } from 'react';
import { PageView } from '@/content/sections';
import { defaultContent, findPage, type SiteContent } from '@/content/site';
import { getSiteContent } from '@/lib/content';
import AdminPage from '@/pages/AdminPage';

function useRoute(): string {
  const [route, setRoute] = useState(window.location.pathname || '/');
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const data = await getSiteContent();
      setContent(data);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem('agi-theme');
    const dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, []);

  if (route === '/secret-admin') {
    return <AdminPage />;
  }

  const page = findPage(content, route);
  if (!loaded || !page) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        {loaded ? 'Page not found.' : 'Loading…'}
      </div>
    );
  }

  return <PageView page={page} settings={content.settings} />;
}
