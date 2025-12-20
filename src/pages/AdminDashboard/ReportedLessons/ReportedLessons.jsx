import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ReportedLessons = () => {
  const axiosSecure = useAxiosSecure();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  /**
   */
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/reports');
      const rawReports = res.data.data || res.data || [];

      if (!Array.isArray(rawReports) || rawReports.length === 0) {
        setReports([]);
        return;
      }

      // Group reports by lessonId
      const grouped = rawReports.reduce((acc, r) => {
        const lessonId = r.lessonId;
        if (!lessonId) return acc;
        if (!acc[lessonId]) acc[lessonId] = [];
        acc[lessonId].push(r);
        return acc;
      }, {});

      // Fetch lesson details for each lessonId
      const lessonIds = Object.keys(grouped);
      const lessonFetches = lessonIds.map(id =>
        axiosSecure.get('/add-lessons', { params: { id } })
          .then(r => ({ id, lesson: r.data.data || r.data || null }))
          .catch(err => {
            console.error(`Failed to fetch lesson ${id}:`, err);
            return { id, lesson: null };
          })
      );

      const lessonsResults = await Promise.all(lessonFetches);

      /**
       */
      const items = lessonsResults
        .filter(({ lesson }) => lesson !== null) 
        .map(({ id, lesson }) => {
          const itemReports = grouped[id] || [];
          const lastReportedAt = itemReports
            .map(r => r.timestamp || r.createdAt)
            .filter(Boolean)
            .map(t => new Date(t))
            .sort((a, b) => b - a)[0] || null;

          return {
            lesson,
            reports: itemReports,
            reportCount: itemReports.length,
            lastReportedAt: lastReportedAt ? lastReportedAt.toISOString() : null
          };
        });

      setReports(items);
    } catch (err) {
      console.error('Error fetching reported lessons:', err);
      toast.error('Failed to load reported lessons');
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  /**
   * 3. useEffect now safely depends on fetchReports
   */
  useEffect(() => {
    fetchReports();
  }, [axiosSecure,fetchReports]);

  const handleOpenModal = (item) => setSelectedLesson(item);
  const handleCloseModal = () => setSelectedLesson(null);

const handleDeleteLesson = async (item) => {
  const lessonId = item.lesson?._id || item.reports[0]?.lessonId;
  
  if (!lessonId) {
    toast.error('Could not find Lesson ID for this report');
    return;
  }

  if (!confirm(`Delete this lesson and all associated reports?`)) return;

  setProcessingId(lessonId);
  try {
    const res = await axiosSecure.delete(`/admin/lessons/${lessonId}`);
    
    if (res.data?.success) {
      toast.success('Lesson and reports cleared');
      handleCloseModal();

      // 🔹 Remove lesson from reports state
      setReports(prev => prev.filter(r => r.lesson?._id !== lessonId));
    }
  } catch (err) {
    toast.error('Cleanup failed');
    console.error(err);
  } finally {
    setProcessingId(null);
  }
};


const handleIgnoreReports = async (item) => {
  const lessonId = item.lesson?._id || item.reports[0]?.lessonId;
  if (!lessonId) return;

  setProcessingId(lessonId);
  try {
    const res = await axiosSecure.patch(`/admin/reported-lessons/${lessonId}/ignore`);
    if (res.data?.success) {
      toast.success('Reports resolved');
      handleCloseModal();

      // Remove from table
      setReports(prev => prev.filter(r => r.lesson?._id !== lessonId));
    }
  } catch (err) {
    toast.error('Failed to ignore reports', err);
  } finally {
    setProcessingId(null);
  }
};


  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reported Lessons</h2>
          <p className="text-gray-500">Moderation dashboard for community flags.</p>
        </div>
        <div className="stats shadow bg-error text-error-content">
          <div className="stat py-2 px-4">
            <div className="stat-title text-error-content opacity-70">Active Flags</div>
            <div className="stat-value text-2xl">{reports.length}</div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Lesson</th>
                <th>Author</th>
                <th>Category</th>
                <th>Reports</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400 italic">
                    All clear! No lessons are currently reported.
                  </td>
                </tr>
              ) : (
                reports.map((item, index) => (
                  <tr key={item.lesson?._id || index}>
                    <th className="text-gray-400 font-normal">{index + 1}</th>
                    <td className="max-w-xs font-semibold">{item.lesson?.title || 'Untitled'}</td>
                    <td className="text-sm">
                      {item.lesson?.authorName || item.lesson?.email}
                      <div className="opacity-50 text-xs">{item.lesson?.email}</div>
                    </td>
                    <td><div className="badge badge-ghost text-xs">{item.lesson?.category || 'General'}</div></td>
                    <td>
                      <div className="badge badge-error gap-2 text-white font-bold">
                        {item.reportCount}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button className="btn btn-xs btn-outline" onClick={() => handleOpenModal(item)}>View</button>
                        <button 
                          className="btn btn-xs btn-error text-white" 
                          disabled={processingId === item.lesson?._id}
                          onClick={() => handleDeleteLesson(item)}
                        >
                          {processingId === item.lesson?._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Details Modal */}
      {selectedLesson && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl border-t-4 border-error">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-2xl">Report Details</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div className="mb-6">
              <span className="text-xs uppercase font-bold text-gray-400">Lesson Title</span>
              <p className="text-lg font-medium">{selectedLesson.lesson?.title}</p>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedLesson.reports.map((r, idx) => (
                <div key={r._id || idx} className="bg-base-200 p-4 rounded-xl relative border border-base-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary">{r.reporterEmail || 'Anonymous Reporter'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(r.timestamp || r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1">Reason: <span className="font-normal text-gray-700">{r.reason}</span></p>
                  {r.details && (
                    <div className="mt-2 p-2 bg-white rounded border text-xs text-gray-600 italic">
                      "{r.details}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-action flex gap-2">
              <button className="btn btn-ghost flex-1" onClick={handleCloseModal}>Back</button>
              <button 
                className="btn btn-outline btn-success flex-1" 
                onClick={() => handleIgnoreReports(selectedLesson)}
              >
                Dismiss Reports
              </button>
              <button 
                className="btn btn-error text-white flex-1" 
                onClick={() => handleDeleteLesson(selectedLesson)}
              >
                Delete Content
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={handleCloseModal}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ReportedLessons;