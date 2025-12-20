import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageLessons = () => {
  const axiosSecure = useAxiosSecure();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // all / Public / Private
  const [flagFilter, setFlagFilter] = useState('all'); // all / flagged / clean

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/admin/lessons');
        // Expect: { success: true, data: [ { ...lesson } ] }
        setLessons(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error fetching lessons:', err);
        toast.error('Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [axiosSecure]);

  const handleDeleteLesson = async (lesson) => {
    if (!confirm(`Delete lesson "${lesson.title}"? This cannot be undone.`)) return;
    setUpdatingId(lesson._id);
    try {
      const res = await axiosSecure.delete(`/admin/lessons/${lesson._id}`);
      if (res.data.success) {
        toast.success('Lesson deleted');
        setLessons(prev => prev.filter(l => l._id !== lesson._id));
      } else {
        toast.error(res.data.message || 'Failed to delete lesson');
      }
    } catch (err) {
      console.error('Error deleting lesson:', err);
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    } finally {
      setUpdatingId(null);
    }
  };


  // handler
const handleToggleFeatured = async (lesson) => {
  setUpdatingId(lesson._id);
  try {
    const res = await axiosSecure.patch(`/admin/lessons/${lesson._id}`, {
      isFeatured: !lesson.isFeatured
    });
    if (res.data.success) {
      toast.success(lesson.isFeatured ? 'Removed from featured' : 'Marked as featured');
      setLessons(prev =>
        prev.map(l => l._id === lesson._id ? { ...l, isFeatured: !lesson.isFeatured } : l)
      );
    } else {
      toast.error(res.data.message || 'Failed to update lesson');
    }
  } catch (err) {
    console.error('Error updating featured flag:', err);
    toast.error(err.response?.data?.message || 'Failed to update lesson');
  } finally {
    setUpdatingId(null);
  }
};


  const handleMarkReviewed = async (lesson) => {
    setUpdatingId(lesson._id);
    try {
      const res = await axiosSecure.patch(`/admin/lessons/${lesson._id}`, {
        isReviewed: true,
        reported: false // clear flag if you want
      });
      if (res.data.success) {
        toast.success('Lesson marked as reviewed');
        setLessons(prev =>
          prev.map(l => l._id === lesson._id ? { ...l, isReviewed: true, reported: false } : l)
        );
      } else {
        toast.error(res.data.message || 'Failed to mark as reviewed');
      }
    } catch (err) {
      console.error('Error marking reviewed:', err);
      toast.error(err.response?.data?.message || 'Failed to mark as reviewed');
    } finally {
      setUpdatingId(null);
    }
  };

  // Derived stats (client-side)
  const stats = useMemo(() => {
    const totalPublic = lessons.filter(l => l.privacy === 'Public').length;
    const totalPrivate = lessons.filter(l => l.privacy === 'Private').length;
    const totalFlagged = lessons.filter(l => l.reported || l.isFlagged).length;
    return { totalPublic, totalPrivate, totalFlagged };
  }, [lessons]);

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      if (categoryFilter !== 'all' && l.category !== categoryFilter) return false;
      if (visibilityFilter !== 'all' && l.privacy !== visibilityFilter) return false;
      const isFlagged = l.reported || l.isFlagged;
      if (flagFilter === 'flagged' && !isFlagged) return false;
      if (flagFilter === 'clean' && isFlagged) return false;
      return true;
    });
  }, [lessons, categoryFilter, visibilityFilter, flagFilter]);

  const allCategories = Array.from(new Set(lessons.map(l => l.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Lessons</h2>
          <p className="text-gray-600 text-sm">
            Review, feature, and moderate lessons created by all users.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <StatPill label="Public" value={stats.totalPublic} color="badge-success" />
          <StatPill label="Private" value={stats.totalPrivate} color="badge-ghost" />
          <StatPill label="Flagged" value={stats.totalFlagged} color="badge-error" />
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-wrap gap-4">
          <div className="form-control">
            <label className="label text-sm font-semibold">Category</label>
            <select
              className="select select-bordered select-sm w-full min-w-40"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label text-sm font-semibold">Visibility</label>
            <select
              className="select select-bordered select-sm w-full min-w-40"
              value={visibilityFilter}
              onChange={e => setVisibilityFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label text-sm font-semibold">Flags</label>
            <select
              className="select select-bordered select-sm w-full min-w-40"
              value={flagFilter}
              onChange={e => setFlagFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="flagged">Flagged / Reported</option>
              <option value="clean">Clean</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lessons table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Privacy</th>
                  <th>Flags</th>
                  <th>Featured</th>
                  <th>Reviewed</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6">
                      No lessons match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((lesson, index) => {
                    const isFlagged = lesson.reported || lesson.isFlagged;
                    return (
                      <tr key={lesson._id}>
                        <td>{index + 1}</td>
                        <td className="max-w-xs">
                          <div className="font-semibold truncate" title={lesson.title}>
                            {lesson.title}
                          </div>
                        </td>
                        <td className="text-sm">
                          {lesson.author?.name || lesson.author?.email || '—'}
                          <div className="text-xs text-gray-500">
                            {lesson.author?.email}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-outline">{lesson.category}</span>
                        </td>
                        <td>
                          <span className="badge badge-ghost">{lesson.privacy || 'Public'}</span>
                        </td>
                        <td>
                          {isFlagged ? (
                            <span className="badge badge-error">Flagged</span>
                          ) : (
                            <span className="badge badge-ghost">Clean</span>
                          )}
                        </td>
                        <td>
                         {lesson.isFeatured ? (
                        <span className="badge badge-success">Featured</span>
                              ) : (
                         <span className="badge badge-ghost">No</span>
                              )}
                           </td>
                        <td>
                          {lesson.isReviewed ? (
                            <span className="badge badge-info">Reviewed</span>
                          ) : (
                            <span className="badge badge-ghost">Pending</span>
                          )}
                        </td>
                        <td>
                          {lesson.createdAt
                            ? new Date(lesson.createdAt).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {/* Toggle featured */}
                            <button
                              className="btn btn-xs btn-outline btn-primary"
                              disabled={updatingId === lesson._id}
                              onClick={() => handleToggleFeatured(lesson)}
                            >
                              {lesson.isFeatured ? 'Unfeature' : 'Make Featured'}
                            </button>
                            {/* Mark reviewed / clear flag */}
                            {!lesson.isReviewed && (
                              <button
                                className="btn btn-xs btn-outline btn-success"
                                disabled={updatingId === lesson._id}
                                onClick={() => handleMarkReviewed(lesson)}
                              >
                                Mark Reviewed
                              </button>
                            )}
                            {/* Delete */}
                            <button
                              className="btn btn-xs btn-error"
                              disabled={updatingId === lesson._id}
                              onClick={() => handleDeleteLesson(lesson)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, color }) => (
  <div className={`badge ${color} badge-lg gap-2`}>
    <span>{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default ManageLessons;