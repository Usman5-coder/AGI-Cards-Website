import { supabase } from '@/integrations/supabase/client';
import { defaultContent, normalizeContent, type SiteContent } from '@/content/site';

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();
    if (error || !data) return defaultContent;
    return normalizeContent(data.data);
  } catch {
    return defaultContent;
  }
}
