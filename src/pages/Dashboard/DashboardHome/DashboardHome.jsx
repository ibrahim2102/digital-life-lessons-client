import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    totalLessons: 0,
    totalSaved: 0,
  });
  const [recentLessons, setRecentLessons] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes, chartRes] = await Promise.all([
          axiosSecure.get('/dashboard/user-stats', { params: { email: user.email } }),
          axiosSecure.get('/dashboard/recent-lessons', { params: { email: user.email } }),
          axiosSecure.get('/dashboard/contribution-chart', { params: { email: user.email } }),
        ]);

        // Expected shapes:
        // statsRes.data => { success, data: { totalLessons, totalSaved } }
        // recentRes.data => { success, data: [ { _id, title, createdAt, privacy, accessLevel } ] }
        // chartRes.data => [ { _id: '2025-01-01', count: 2 }, ... ]

        if (statsRes.data?.data) setStats(statsRes.data.data);
        else setStats(statsRes.data || statsRes.data?.data || { totalLessons: 0, totalSaved: 0 });

        setRecentLessons(recentRes.data.data || recentRes.data || []);
        setChartData(chartRes.data.data || chartRes.data || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosSecure, user?.email]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.displayName || 'Friend'} 👋</h1>
          <p className="text-sm text-gray-500">
            Here’s a quick overview of your learning contributions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/add-lessons" className="btn btn-sm btn-primary">
            Add New Lesson
          </Link>
          <Link to="/dashboard/my-lessons" className="btn btn-sm btn-outline">
            View My Lessons
          </Link>
        </div>
      </div>

      {/* Stats + Chart */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total Lessons */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-1">
                <p className="text-sm text-gray-500">Total Lessons Created</p>
                <p className="text-3xl font-bold">{stats.totalLessons ?? 0}</p>
                <p className="text-xs text-gray-400">
                  Great job! Each lesson can help someone else grow.
                </p>
              </div>
            </div>

            {/* Total Saved */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-1">
                <p className="text-sm text-gray-500">Total Saved / Favorites</p>
                <p className="text-3xl font-bold">{stats.totalSaved ?? 0}</p>
                <p className="text-xs text-gray-400">
                  These are lessons you’ve bookmarked to revisit later.
                </p>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body space-y-2">
                <p className="text-sm font-semibold">Quick Actions</p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link to="/dashboard/add-lessons" className="link link-hover">
                    • Share a new life lesson
                  </Link>
                  <Link to="/dashboard/my-lessons" className="link link-hover">
                    • Review or edit your lessons
                  </Link>
                  <Link to="/dashboard/my-favourites" className="link link-hover">
                    • Revisit your saved favorites
                  </Link>
                  <Link to="/dashboard/my-profile" className="link link-hover">
                    • Update your profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Chart + Recent Lessons */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contributions chart */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="text-sm font-semibold mb-2">
                  Weekly Contributions
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Number of lessons you’ve added or updated over the last days.
                </p>
                {chartData.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No recent activity yet. Start by adding your first lesson!
                  </p>
                ) : (
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#4f46e5"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Recent lessons */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="text-sm font-semibold mb-2">
                  Recently Added Lessons
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Your latest reflections and stories.
                </p>
                {recentLessons.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    You haven’t added any lessons yet. Start by sharing something you’ve learned.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentLessons.map((lesson) => (
                      <li key={lesson._id} className="py-2 flex justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lesson.createdAt
                              ? new Date(lesson.createdAt).toLocaleDateString()
                              : ''}
                            {' • '}
                            {lesson.privacy || 'Public'} • {lesson.accessLevel || 'Free'}
                          </p>
                        </div>
                        {/* <Link
                          to={`/lessons/${lesson._id}`}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Open →
                        </Link> */}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;