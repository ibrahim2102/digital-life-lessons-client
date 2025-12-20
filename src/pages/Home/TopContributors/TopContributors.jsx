import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const TopContributors = () => {
  const axiosSecure = useAxiosSecure();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/top-contributors');
        // Expect: { success: true, data: [ { email, name, totalLessons, totalSaves, totalViews } ] }
        setContributors(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error fetching top contributors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [axiosSecure]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Top Contributors of the Week</h2>
          <p className="text-sm text-gray-500">
            Creators whose lessons are helping the community grow.
          </p>
        </div>
        <Link
          to="/dashboard/add-lessons"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Add your lesson
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((c, idx) => (
            <div
              key={c.email || idx}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="avatar placeholder">
                  <div className="w-10 rounded-full bg-indigo-100 text-indigo-700">
                    <span className="text-sm font-semibold">
                      {(c.name || c.email || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div>
                  <p className="text-sm font-semibold">
                    {c.name || c.email || 'Unknown user'}
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    {c.email}
                  </p> */}
                  <p className="mt-1 text-xs text-gray-500">
                    {c.totalLessons} lesson{c.totalLessons !== 1 ? 's' : ''} •{' '}
                    {c.totalSaves ?? 0} saves • {c.totalViews ?? 0} views
                  </p>
                </div>
              </div>
        
            </div>
          ))}

          {!loading && contributors.length === 0 && (
            <p className="text-sm text-gray-500">
              No contributors yet. Encourage users to share their first lesson!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default TopContributors;