import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MostSavedLessons = () => {
  const axiosSecure = useAxiosSecure();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostSaved = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/lessons/most-saved');
        setLessons(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error fetching most saved lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMostSaved();
  }, [axiosSecure]);

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Most Saved Lessons</h2>
          <p className="text-sm text-base-content/70 mt-2">
            Simple ranking of lessons with the highest saves.
          </p>
        </div>
        <Link
          to="/lessons/saved"
          className="btn btn-secondary btn-outline btn-sm"
        >
          See rankings
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-base-content/60">
          No saved lessons yet. Start bookmarking favorites.
        </p>
      ) : (
        <ul className="divide-y divide-base-200 rounded-xl border border-base-200 bg-base-100 shadow-sm">
          {lessons.map((lesson, index) => (
            <li key={lesson._id} className="flex items-center justify-between px-6 py-4 hover:bg-base-200/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="w-8 text-lg font-bold text-base-content/50">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-base-content">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {lesson.author?.name || lesson.author?.email || 'Anonymous'} •{' '}
                    {lesson.category || 'Life'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-base-content/70">
                <span className="badge badge-ghost gap-2">Saves: <span className="font-bold">{lesson.saves ?? 0}</span></span>
          
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </section>
  );
};

export default MostSavedLessons;