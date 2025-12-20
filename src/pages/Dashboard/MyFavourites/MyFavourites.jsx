import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyFavourites = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    // Fetch saved lessons from add-lessons collection (only user's saved lessons)
    useEffect(() => {
        const fetchFavourites = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axiosSecure.get('/add-lessons', {
                    params: { saved: true, email: user.email }
                });
                const userSavedLessons = res.data.data || res.data || [];
                setFavourites(userSavedLessons);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                toast.error('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, [user?.email, axiosSecure]);

    // Handle remove from favorites
    const handleRemoveFavorite = async (lessonId) => {
        if (!user?.email) return;

        setRemoving(lessonId);
        try {
            const res = await axiosSecure.delete(`/add-lessons/${lessonId}/unsave`, {
                data: { email: user.email }
            });

            if (res.data?.success) {
                setFavourites(prev => prev.filter(fav => fav._id !== lessonId));
                toast.success('Removed from favorites');
            } else {
                toast.error(res.data?.message || 'Failed to remove from favorites');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error(error?.response?.data?.message || 'Failed to remove from favorites');
        } finally {
            setRemoving(null);
        }
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
                <p className="text-gray-600">
                    {favourites.length} favorite lesson{favourites.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Favorites Table */}
            {favourites.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body text-center py-12">
                        <p className="text-gray-500 text-lg">
                            You have no favorite lessons yet.
                        </p>
                        <button
                            onClick={() => navigate('/details-lessons')}
                            className="btn btn-primary btn-sm mt-4 w-fit mx-auto"
                        >
                            Browse Lessons
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 shadow-xl overflow-hidden">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th>Lesson Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Emotional Tone</th>
                                        <th>Access Level</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {favourites.map((fav) => (
                                        <tr key={fav._id}>
                                            {/* Lesson Title */}
                                            <td className="font-semibold max-w-xs">
                                                <div className="line-clamp-2 text-sm">
                                                    {fav.title || 'Untitled'}
                                                </div>
                                            </td>

                                            {/* Author */}
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="avatar">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                            {fav.authorPhoto ? (
                                                                <img src={fav.authorPhoto} alt={fav.authorName} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs font-semibold">
                                                                    {(fav.authorName || 'U').charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm">
                                                        {fav.authorName || fav.email || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td>
                                                <span className="badge badge-outline badge-sm">
                                                    {fav.category || (Array.isArray(fav.categories) && fav.categories.join(', ')) || 'General'}
                                                </span>
                                            </td>

                                            {/* Emotional Tone */}
                                            <td>
                                                {fav.emotionalTone || fav.tone || '-'}
                                            </td>

                                            {/* Access Level */}
                                            <td>
                                                <span className={`badge badge-sm ${
                                                    fav.accessLevel === 'Premium' ? 'badge-warning' : 'badge-info'
                                                }`}>
                                                    {fav.accessLevel || 'Free'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="flex gap-2">
                                                    {/* View Details Button */}
                                                    <button
                                                        onClick={() =>
                                                            navigate(`/details-lessons/${fav._id}`)
                                                        }
                                                        className="btn btn-ghost btn-xs"
                                                        title="View Lesson Details"
                                                    >
                                                        👁️ View
                                                    </button>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemoveFavorite(fav._id)}
                                                        disabled={removing === fav._id}
                                                        className="btn btn-error btn-xs"
                                                        title="Remove from Favorites"
                                                    >
                                                        {removing === fav._id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            '✕ Remove'
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            {favourites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Total Favorites</div>
                            <div className="stat-value text-primary">{favourites.length}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyFavourites;