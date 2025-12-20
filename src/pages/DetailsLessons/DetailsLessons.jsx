import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import usePremium from '../../hooks/usePremium';

const DetailsLessons = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  
  // Filter & Sort States
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [emotionalToneFilter, setEmotionalToneFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Static lists of all available options
  const allCategories = [
    'Personal Growth',
    'Career',
    'Relationships',
    'Mindset',
    'Mistakes Learned'
  ];

  const allEmotionalTones = [
    'Motivational',
    'Sad',
    'Realization',
    'Gratitude'
  ];

  // Handle lesson click - check premium access
  const handleLessonClick = (lesson) => {
    // If lesson is premium and user is not premium
    if (lesson.accessLevel === 'Premium' && !isPremium) {
      toast.info('This is a premium lesson. Please upgrade to access.');
      navigate('/pricing');
      return;
    }
    
    // If not logged in and lesson is premium
    if (lesson.accessLevel === 'Premium' && !user?.email) {
      toast.info('Please sign in and upgrade to premium to access this lesson.');
      navigate('/login');
      return;
    }

    // Allow navigation for free lessons or premium users
    navigate(`/details-lessons/${lesson._id}`);
  };

  // Fetch all public lessons
  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/add-lessons');
      const lessonsData = res.data.data || res.data || [];
      
      // Filter only public lessons
      const publicLessons = lessonsData.filter(lesson => lesson.privacy === 'Public' || !lesson.privacy);
      setLessons(publicLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error(error.response?.data?.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  // Apply filters and search on lessons data
  useEffect(() => {
    let filtered = [...lessons];

    // Search filter (by title and keyword)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title?.toLowerCase().includes(query) ||
        lesson.description?.toLowerCase().includes(query) ||
        lesson.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === categoryFilter);
    }

    // Emotional tone filter
    if (emotionalToneFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.emotionalTone === emotionalToneFilter);
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'mostSaved') {
      filtered.sort((a, b) => (b.saves || 0) - (a.saves || 0));
    }

    setFilteredLessons(filtered);
  }, [lessons, categoryFilter, emotionalToneFilter, sortBy, searchQuery]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleSaveLesson = async (e, lesson) => {
    e.stopPropagation();
    
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
      } else {
        toast.error(res.data?.message || 'Failed to save lesson');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setSavingId(null);
    }
  };

  if (loading || premiumLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Lessons</h1>
        <p className="text-gray-600">Browse through public lessons shared by our community</p>
        <p className="text-xs text-gray-400 mt-1">
          Found {filteredLessons.length} of {lessons.length} lesson(s)
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title, keyword, or category..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters & Sort */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h3 className="font-semibold mb-4">Filter & Sort</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm">Category</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Emotional Tone Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm">Emotional Tone</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={emotionalToneFilter}
                onChange={(e) => setEmotionalToneFilter(e.target.value)}
              >
                <option value="all">All Tones</option>
                {allEmotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-sm">Sort By</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="mostSaved">Most Saved</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="form-control flex justify-end">
              <label className="label">
                <span className="label-text font-semibold text-sm">&nbsp;</span>
              </label>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setCategoryFilter('all');
                  setEmotionalToneFilter('all');
                  setSortBy('newest');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <p className="text-gray-500 mb-2">
              {searchQuery || categoryFilter !== 'all' || emotionalToneFilter !== 'all'
                ? 'No lessons match your filters.'
                : 'No lessons found.'}
            </p>
            {(searchQuery || categoryFilter !== 'all' || emotionalToneFilter !== 'all') && (
              <button
                className="btn btn-primary btn-sm w-fit mx-auto mt-2"
                onClick={() => {
                  setCategoryFilter('all');
                  setEmotionalToneFilter('all');
                  setSortBy('newest');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const isPremiumLesson = lesson.accessLevel === 'Premium';
            const canAccess = !isPremiumLesson || isPremium;

            return (
              <article
                key={lesson._id}
                className={`card bg-base-100 shadow-xl hover:shadow-2xl transition cursor-pointer group ${
                  isPremiumLesson && !canAccess ? 'opacity-75' : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                {/* Premium Lock Overlay */}
                {isPremiumLesson && !canAccess && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl z-10 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="font-semibold">Premium Content</p>
                      <p className="text-sm">Upgrade to access</p>
                    </div>
                  </div>
                )}

                {/* Image */}
                {(lesson.image || lesson.imageURL || lesson.photoURL) && (
                  <figure className="h-48 overflow-hidden bg-gray-100 relative">
                    <img
                      src={lesson.image || lesson.imageURL || lesson.photoURL}
                      alt={lesson.title || 'Lesson image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                    {isPremiumLesson && (
                      <div className="absolute top-2 right-2">
                        <span className="badge badge-warning gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Premium
                        </span>
                      </div>
                    )}
                  </figure>
                )}

                <div className="card-body">
                  {/* Top badges */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-primary">
                      {lesson.category || 'General'}
                    </span>
                    <div className="flex gap-1">
                      <span className={`badge ${isPremiumLesson ? 'badge-warning' : 'badge-outline'}`}>
                        {lesson.accessLevel || 'Free'}
                      </span>
                      {lesson.isFeatured && (
                        <span className="badge badge-warning">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="card-title line-clamp-2">
                    {lesson.title}
                  </h2>

                  {/* Description - Blurred for premium if not accessible */}
                  <p className={`line-clamp-3 text-sm mb-4 ${
                    isPremiumLesson && !canAccess 
                      ? 'text-gray-400 blur-sm select-none' 
                      : 'text-gray-600'
                  }`}>
                    {isPremiumLesson && !canAccess 
                      ? 'This is premium content. Upgrade to premium to read the full lesson.'
                      : lesson.description
                    }
                  </p>

                  {/* Creator mini profile */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {lesson.authorPhoto ? (
                          <img src={lesson.authorPhoto} alt={lesson.authorName || 'Author'} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            {(lesson.authorName || lesson.email || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {lesson.authorName || lesson.email || 'Unknown user'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Creator
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    {lesson.emotionalTone && (
                      <span className="badge badge-ghost badge-sm">
                        {lesson.emotionalTone}
                      </span>
                    )}
                    {lesson.createdAt && (
                      <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                    )}
                    <span>💾 {lesson.saves || 0} saves</span>
                  </div>

                  {/* Footer */}
                  <div className="card-actions justify-between items-center">
                    <button
                      onClick={(e) => handleSaveLesson(e, lesson)}
                      disabled={savingId === lesson._id || (isPremiumLesson && !canAccess)}
                      className="btn btn-sm btn-outline"
                    >
                      {savingId === lesson._id ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Saving...
                        </>
                      ) : (
                        '🔖 Save'
                      )}
                    </button>
                    {isPremiumLesson && !canAccess ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/pricing');
                        }}
                        className="btn btn-sm btn-warning"
                      >
                        Upgrade →
                      </button>
                    ) : (
                      <Link
                        to={`/details-lessons/${lesson._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Read More →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailsLessons;