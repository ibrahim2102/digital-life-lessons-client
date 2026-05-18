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
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Top Contributors of the Week</h2>
          <p className="text-sm text-base-content/70 mt-2">
            Creators whose lessons are helping the community grow.
          </p>
        </div>
        <Link
          to="/dashboard/add-lessons"
          className="btn btn-primary btn-outline btn-sm"
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
              className="card bg-base-100 shadow-md hover:shadow-lg transition-all border border-base-200"
            >
              <div className="card-body flex flex-row items-center gap-4 p-4">
                {/* Avatar */}
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">
                      {(c.name || c.email || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div>
                  <h3 className="font-bold text-base">
                    {c.name || c.email || 'Unknown user'}
                  </h3>
                  <p className="text-xs text-base-content/60 mt-1">
                    {c.totalLessons} lesson{c.totalLessons !== 1 ? 's' : ''} •{' '}
                    {c.totalSaves ?? 0} saves • {c.totalViews ?? 0} views
                  </p>
                </div>
              </div>
        
            </div>
          ))}

          {!loading && contributors.length === 0 && (
            <p className="text-sm text-base-content/60 text-center w-full col-span-full">
              No contributors yet. Encourage users to share their first lesson!
            </p>
          )}
        </div>
      )}
      </div>
    </section>
  );
};

export default TopContributors;