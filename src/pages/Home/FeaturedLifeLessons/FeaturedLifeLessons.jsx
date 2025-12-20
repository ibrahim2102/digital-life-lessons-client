import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const FeaturedLifeLessons = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchFeaturedLessons = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/featured-lessons');
        setLessons(res.data?.data || res.data || []);
      } catch (err) {
        console.error('Error fetching featured lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLessons();
  }, [axiosSecure]);

  const handleSaveLesson = async (e, lesson) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!user?.email) {
      toast.info('Please sign in to save lessons.');
      navigate('/login');
      return;
    }

    setSavingId(lesson._id);

    try {
      const res = await axiosSecure.post(`/lessons/${lesson._id}/save`, {
        email: user.email,
      });

      if (res.data?.success) {
        toast.success('Lesson saved to your favorites!');
        setLessons(prev =>
          prev.map(l =>
            l._id === lesson._id
              ? { ...l, saves: (l.saves ?? 0) + 1 }
              : l
          )
        );
      } else {
        toast.error(res.data?.message || 'Failed to save lesson');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setSavingId(null);
    }
  };

  const handleCardClick = (lessonId) => {
    navigate(`/lesson-info/${lessonId}`);
  };

  return (
    <section className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Life Lessons
          </h2>
          <p className="text-sm text-gray-600">
            Handpicked lessons making an impact in the community.
          </p>
        </div>

        <Link
          to="/dashboard/add-lessons"
          className="btn btn-primary btn-sm gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Share Your Lesson
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && lessons.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-linear-to-br from-gray-50 to-gray-100 px-6 py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 font-medium">
            No featured lessons yet.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Admins can mark lessons as featured.
          </p>
        </div>
      )}

      {/* GRID */}
      {!loading && lessons.length > 0 && (
        <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <article
              key={lesson._id}
              onClick={() => handleCardClick(lesson._id)}
              className="group relative flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-primary/20"
            >
              {/* FEATURED BADGE */}
              <div className="absolute top-4 right-4 z-10">
                <span className="badge badge-warning gap-1 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </div>

              {/* IMAGE SECTION */}
              {lesson.image && (
                <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* CONTENT SECTION */}
              <div className="flex flex-col flex-1 p-5 space-y-3">
                {/* CATEGORY & ACCESS BADGES */}
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-primary badge-sm font-medium">
                    {lesson.category || 'General'}
                  </span>
                  <div className="flex items-center gap-2">
                    {lesson.accessLevel === 'Premium' && (
                      <span className="badge badge-warning badge-sm gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                      </span>
                    )}
                    {lesson.accessLevel === 'Free' && (
                      <span className="badge badge-ghost badge-sm">Free</span>
                    )}
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
                  {lesson.description}
                </p>

                {/* METADATA */}
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  {lesson.emotionalTone && (
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{lesson.emotionalTone}</span>
                    </div>
                  )}
                  {lesson.saves > 0 && (
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span>{lesson.saves} saved</span>
                    </div>
                  )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={(e) => handleSaveLesson(e, lesson)}
                    disabled={savingId === lesson._id}
                    className="btn btn-sm btn-outline btn-primary gap-2 flex-1"
                  >
                    {savingId === lesson._id ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(lesson._id);
                    }}
                    className="btn btn-sm btn-primary gap-2"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button> */}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedLifeLessons;