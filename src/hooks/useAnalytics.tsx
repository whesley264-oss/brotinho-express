import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageView {
  id: string;
  page: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}

export interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  viewsByPage: Record<string, number>;
  viewsByDay: { date: string; views: number }[];
}

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todayViews = (pageViews || []).filter(
        (v) => new Date(v.created_at) >= today
      ).length;

      const weekViews = (pageViews || []).filter(
        (v) => new Date(v.created_at) >= weekAgo
      ).length;

      const monthViews = (pageViews || []).filter(
        (v) => new Date(v.created_at) >= monthAgo
      ).length;

      // Views by page
      const viewsByPage: Record<string, number> = {};
      (pageViews || []).forEach((v) => {
        viewsByPage[v.page] = (viewsByPage[v.page] || 0) + 1;
      });

      // Views by day (last 7 days)
      const viewsByDay: { date: string; views: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const views = (pageViews || []).filter((v) => {
          const viewDate = new Date(v.created_at).toISOString().split('T')[0];
          return viewDate === dateStr;
        }).length;
        viewsByDay.push({ date: dateStr, views });
      }

      return {
        totalViews: (pageViews || []).length,
        todayViews,
        weekViews,
        monthViews,
        viewsByPage,
        viewsByDay,
      } as AnalyticsData;
    },
  });
};

// Track page view
export const trackPageView = async (page: string) => {
  try {
    await supabase.from('page_views').insert({
      page,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};
