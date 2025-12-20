import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon
} from 'react-share';

const DetailsLessonInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
//   const [viewsCount, setViewsCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(Math.floor(Math.random() * 10001));

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Comments state
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const reportReasons = [
    'Inappropriate Content',
    'Hate Speech or Harassment',
    'Misleading or False Information',
    'Spam or Promotional Content',
    'Sensitive or Disturbing Content',
    'Other'
  ];

  // Fetch lesson by ID
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/add-lessons/${id}`);
        const data = res.data.data || res.data;
        setLesson(data);
        
        if (data) {
           setLikesCount(data.reactions || data.likesCount || 0);
        // Only set views if it exists in data, otherwise keep random value
        if (data.views && data.views > 0) {
          setViewsCount(data.views);
        }
        // else viewsCount stays as the random value generated above
        setSavesCount(data.saves || 0);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast.error('Failed to load lesson information');
      navigate('/details-lessons');
    } finally {
      setLoading(false);
    }
  };

    if (id) fetchLesson();
  }, [id, axiosSecure, navigate]);

  // Check if user has liked this lesson
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user?.email || !lesson?._id) return;

      try {
        const res = await axiosSecure.get(`/add-lessons/${lesson._id}/check-liked`, {
          params: { email: user.email },
        });
        setLiked(res.data.isLiked || false);
      } catch (err) {
        // If endpoint doesn't exist, check locally
        if (lesson.likes && Array.isArray(lesson.likes)) {
          setLiked(lesson.likes.includes(user.email));
        }
        else{
            console.log('error', err)
        }
      }
    };

    if (lesson && user) {
      checkIfLiked();
    }
  }, [user?.email, user, lesson, axiosSecure]);

  // Check if lesson is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user?.email || !lesson?._id) return;

      try {
        const res = await axiosSecure.get(`/add-lessons/${lesson._id}/check-saved`, {
          params: { email: user.email },
        });
        setIsSaved(res.data.isSaved || false);
      } catch (err) {
        console.debug('Check saved endpoint not available', err);
      }
    };

    if (lesson && user) {
      checkIfSaved();
    }
  }, [user?.email, user, lesson, lesson?._id, axiosSecure]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!lesson?._id) return;

      try {
        setLoadingComments(true);
        const res = await axiosSecure.get(`/lessonComments/${lesson._id}/comments`);
        setComments(res.data.data || res.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (lesson?._id) {
      fetchComments();
    }
  }, [lesson?._id, axiosSecure]);

  // Handle Save/Remove from Favorites
  const handleSaveLesson = async () => {
    if (!user?.email) {
      toast.info('Please sign in to save lessons.');
      navigate('/login');
      return;
    }

    if (!lesson?._id) return;

    setSaving(true);
    try {
      if (isSaved) {
        const res = await axiosSecure.delete(`/add-lessons/${lesson._id}/unsave`, {
          data: { email: user.email },
        });

        if (res.data?.success) {
          setIsSaved(false);
          setSavesCount(prev => Math.max(0, prev - 1));
          toast.success('Removed from favorites');
        } else {
          toast.error(res.data?.message || 'Failed to remove from favorites');
        }
      } else {
        const res = await axiosSecure.post(`/lessons/${lesson._id}/save`, {
          email: user.email,
        });

        if (res.data?.success) {
          setIsSaved(true);
          setSavesCount(prev => prev + 1);
          toast.success('Lesson saved to your favorites!');
        } else {
          toast.error(res.data?.message || 'Failed to save lesson');
        }
      }
    } catch (err) {
      console.error('Save/Unsave error:', err);
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    } finally {
      setSaving(false);
    }
  };

  // Handle Like/Unlike
  const handleLike = async () => {
    if (!user?.email) {
      toast.info('Please log in to like');
      navigate('/login');
      return;
    }

    if (!lesson?._id) return;

    setLiking(true);
    try {
      const res = await axiosSecure.post(`/add-lessons/${lesson._id}/like`, {
        email: user.email,
        action: liked ? 'unlike' : 'like'
      });

      if (res.data?.success) {
        setLiked(!liked);
        setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
        // Update lesson state
        setLesson(prev => ({
          ...prev,
          reactions: liked ? Math.max(0, (prev.reactions || 0) - 1) : (prev.reactions || 0) + 1,
          likes: liked 
            ? (prev.likes || []).filter(email => email !== user.email)
            : [...(prev.likes || []), user.email]
        }));
      } else {
        toast.error(res.data?.message || 'Failed to update like');
      }
    } catch (err) {
      console.error('Like error:', err);
      toast.error(err.response?.data?.message || 'Failed to update like');
    } finally {
      setLiking(false);
    }
  };

  // Handle Report Lesson
  const handleReportClick = () => {
    if (!user?.email) {
      toast.info('Please sign in to report lessons.');
      navigate('/login');
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    if (!user?.email || !lesson?._id) return;

    setReporting(true);
    try {
      const res = await axiosSecure.post(`/reports/${lesson._id}/report`, {
        reporterEmail: user.email,
        reason: reportReason,
        timestamp: new Date()
      });

      if (res.data?.success) {
        toast.success('Lesson reported. Thank you for your feedback.');
        setShowReportModal(false);
        setReportReason('');
      } else {
        toast.error(res.data?.message || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Report error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (data) => {
    if (!user?.email) {
      toast.info('Please sign in to post comments.');
      navigate('/login');
      return;
    }

    if (!lesson?._id) return;

    setSubmittingComment(true);
    try {
      const res = await axiosSecure.post(`/lessonComments/${lesson._id}/comments`, {
        comment: data.comment,
        userEmail: user.email,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || null,
        timestamp: new Date()
      });

      if (res.data?.success) {
        // Add new comment to list
        const newComment = {
          _id: res.data.commentId,
          comment: data.comment,
          userEmail: user.email,
          userName: user.displayName || user.email,
          userPhoto: user.photoURL || null,
          timestamp: new Date()
        };
        setComments(prev => [newComment, ...prev]);
        reset();
        toast.success('Comment posted!');
      } else {
        toast.error(res.data?.message || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Comment error:', err);
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Format number to K notation
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  const createdAt = lesson.createdAt ? new Date(lesson.createdAt) : null;
  const updatedAt = lesson.updatedAt ? new Date(lesson.updatedAt) : null;

  // Ensure authorStats is defined to avoid reference errors in rendering
//   const authorStats = lesson.authorStats || { totalLessonsCreated: lesson.totalLessonsCreated || 0 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-2"
      >
        ← Back
      </button>

      {/* 1. Lesson Information Section */}
      <section className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-1">{lesson.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="badge badge-primary">
                  {lesson.category || 'General'}
                </span>
                {lesson.emotionalTone && (
                  <span className="badge badge-ghost">
                    {lesson.emotionalTone}
                  </span>
                )}
                <span className="badge badge-outline">
                  {lesson.accessLevel || 'Free'}
                </span>
              </div>
            </div>
          </div>

          {lesson.image && (
            <div className="mt-4">
              <img
                src={lesson.image}
                alt={lesson.title}
                className="w-full max-h-80 object-cover rounded-xl"
              />
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Full Description / Story / Insight
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {lesson.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Lesson Metadata Section */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400">
              Created Date
            </h3>
            <p className="text-sm text-gray-800">
              {createdAt ? createdAt.toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400">
              Last Updated
            </h3>
            <p className="text-sm text-gray-800">
              {updatedAt
                ? updatedAt.toLocaleString()
                : createdAt
                ? createdAt.toLocaleString()
                : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-400">
              Visibility
            </h3>
            <p className="text-sm text-gray-800">
              {lesson.privacy || 'Public'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Author / Creator Section */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {lesson.authorPhoto ? (
                <img
                  src={lesson.authorPhoto}
                  alt={lesson.authorName || 'Author'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500">
                  {(lesson.authorName || lesson.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold">
              {lesson.authorName || lesson.email || 'Unknown user'}
            </h3>
            <p className="text-sm text-gray-500">{lesson.email}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
              {/* <div>
                <span className="font-semibold">
                  {authorStats.totalLessonsCreated}
                </span>{' '}
                lessons created
              </div> */}
            </div>
          </div>

          <div className="sm:ml-auto">
  <button
    className="btn btn-outline btn-sm"
    onClick={() =>
      navigate(`/creator-profile/${encodeURIComponent(lesson.email)}`)
    }
  >
    View all lessons by this author
  </button>
</div>
        </div>
      </section>

      {/* 4. Stats & Engagement */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-3">
            Stats & Engagement
          </h3>
          <div className="flex flex-wrap gap-6 text-sm text-gray-700">
            <div>❤️ {likesCount.toLocaleString()} Likes</div>
            <div>🔖 {savesCount.toLocaleString()} Favorites</div>
            <div>👀 {formatNumber(viewsCount)} Views</div>
          </div>
        </div>
      </section>

      {/* 5. Interaction Buttons */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveLesson}
              disabled={saving}
              className={`btn btn-sm ${
                isSaved ? 'btn-primary' : 'btn-outline'
              }`}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {isSaved ? 'Removing...' : 'Saving...'}
                </>
              ) : (
                <>🔖 {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}</>
              )}
            </button>

            <button
              onClick={handleLike}
              disabled={liking}
              className={`btn btn-sm ${
                liked ? 'btn-error' : 'btn-outline'
              }`}
            >
              {liking ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {liked ? 'Unliking...' : 'Liking...'}
                </>
              ) : (
                <>❤️ {liked ? 'Liked' : 'Like'}</>
              )}
            </button>

            <button
              onClick={handleReportClick}
              className="btn btn-sm btn-outline btn-warning"
            >
              🚩 Report Lesson
            </button>
          </div>

          {/* Share */}
          <div>
            <p className="text-sm font-semibold mb-2">Share this lesson</p>
            <div className="flex gap-2">
              <FacebookShareButton
                url={window.location.href}
                quote={lesson.title}
              >
                <FacebookIcon size={36} round />
              </FacebookShareButton>
              <WhatsappShareButton
                url={window.location.href}
                title={lesson.title}
              >
                <WhatsappIcon size={36} round />
              </WhatsappShareButton>
              <LinkedinShareButton
                url={window.location.href}
                title={lesson.title}
                summary={lesson.description}
              >
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comment Section */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body space-y-4">
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmit(handleCommentSubmit)} className="space-y-3">
              <div>
                <textarea
                  {...register('comment', {
                    required: 'Comment is required',
                    minLength: {
                      value: 3,
                      message: 'Comment must be at least 3 characters'
                    }
                  })}
                  className="textarea textarea-bordered w-full"
                  placeholder="Write a comment..."
                  rows="3"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.comment.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submittingComment}
                className="btn btn-primary btn-sm"
              >
                {submittingComment ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </button>
            </form>
          ) : (
            <div className="alert alert-info">
              <span>Please sign in to post comments.</span>
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="divider"></div>
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner"></span>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {comment.userPhoto ? (
                        <img src={comment.userPhoto} alt={comment.userName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          {(comment.userName || comment.userEmail || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.userName || comment.userEmail || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.timestamp
                            ? new Date(comment.timestamp).toLocaleString()
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Report Lesson</h3>
            <p className="mb-4 text-sm text-gray-600">
              Please select a reason for reporting this lesson. Your report will be reviewed by our moderation team.
            </p>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Reason</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                disabled={reporting}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={handleReportSubmit}
                disabled={reporting || !reportReason}
              >
                {reporting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowReportModal(false);
              setReportReason('');
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DetailsLessonInformation;