import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyLessons = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);

    useEffect(() => {
        if (!user?.email) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        const fetchLessons = async () => {
            try {
                const res = await axiosSecure.get('/dashboard/my-lessons', { params: { email: user.email } });
                if (isMounted) {
                    setLessons(res.data.data || res.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err?.response?.data?.message || err.message || 'Failed to load lessons');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchLessons();

        return () => { isMounted = false; };
    }, [user?.email, axiosSecure]);

    // Handle delete lesson
    const handleDeleteClick = (lesson) => {
        setLessonToDelete(lesson);
        setShowDeleteModal(true);
    };

const handleDeleteConfirm = async () => {
    if (!lessonToDelete?._id) {
        toast.error('Invalid lesson ID');
        return;
    }

    try {
        const lessonId = lessonToDelete._id;
        
        // Try different endpoint paths
        let res;
        try {
            res = await axiosSecure.delete(`/dashboard/add-lessons/${lessonId}`);
        } catch (err) {
            // If that fails, try alternative path
            console.log('First attempt failed, trying alternative path...', err);
            res = await axiosSecure.delete(`/lessons/${lessonId}`);
        }

        if (res.data.success) {
            toast.success('Lesson deleted successfully');
            setLessons(prev =>
                prev.filter(lesson => lesson._id !== lessonId)
            );
            setShowDeleteModal(false);
            setLessonToDelete(null);
        } else {
            toast.error(res.data.message || 'Failed to delete lesson');
        }
    } catch (err) {
        console.error('DELETE ERROR:', err);
        console.error('Status:', err.response?.status);
        console.error('URL:', err.config?.url);
        toast.error(err.response?.data?.message || 'Delete failed. Check console for details.');
    }
};


    // Handle update lesson - navigate to update page
    const handleUpdateClick = (lesson) => {
        navigate(`/dashboard/update-lesson/${lesson._id || lesson.id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="alert alert-error">
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">My Lessons</h2>
                <p className="text-gray-600">All lessons created by you</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Privacy</th>
                                    <th>Access Level</th>
                                    <th>Views</th>
                                    <th>Likes</th>
                                    <th>Saves</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6">No lessons found.</td>
                                    </tr>
                                ) : (
                                    lessons.map((lesson) => (
                                        <tr key={lesson._id || lesson.id}>
                                            <td className="font-semibold">{lesson.title}</td>
                                            <td>
                                                <span className="badge badge-outline">
                                                    {lesson.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-ghost">
                                                    {lesson.privacy}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-ghost">
                                                    {lesson.accessLevel}
                                                </span>
                                            </td>
                                            <td>{lesson.views ?? 0}</td>
                                            <td>{lesson.likes ?? 0}</td>
                                            <td>{lesson.saves ?? 0}</td>
                                            <td>{lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleUpdateClick(lesson)}
                                                        title="Update Lesson"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-error"
                                                        onClick={() => handleDeleteClick(lesson)}
                                                        title="Delete Lesson"
                                                    >
                                                        Delete
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
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && lessonToDelete && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-xl mb-4">Delete Lesson</h3>
                        <p className="py-4">
                            Are you sure you want to delete <strong>"{lessonToDelete.title}"</strong>? 
                            This action cannot be undone and the lesson will be permanently removed.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setLessonToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleDeleteConfirm}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop" onClick={() => {
                        setShowDeleteModal(false);
                        setLessonToDelete(null);
                    }}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default MyLessons;
