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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Most Saved Lessons</h2>
          <p className="text-sm text-gray-500">
            Simple ranking of lessons with the highest saves.
          </p>
        </div>
        <Link
          to="/lessons/saved"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          See rankings
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-gray-500">
          No saved lessons yet. Start bookmarking favorites.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {lessons.map((lesson, index) => (
            <li key={lesson._id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-6 text-sm font-semibold text-gray-500">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lesson.author?.name || lesson.author?.email || 'Anonymous'} •{' '}
                    {lesson.category || 'Life'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Saves: <span className="font-semibold">{lesson.saves ?? 0}</span></span>
          
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MostSavedLessons;