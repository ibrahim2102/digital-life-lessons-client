import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});
  const [lessonGrowth, setLessonGrowth] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);


useEffect(() => {
  const fetchStats = async () => {
    try {
      const statsRes = await axiosSecure.get('/admin/stats');
      const lessonGrowthRes = await axiosSecure.get('/admin/lesson-growth');
      const userGrowthRes = await axiosSecure.get('/admin/user-growth');

      setStats(statsRes.data);
      setLessonGrowth(lessonGrowthRes.data);
      setUserGrowth(userGrowthRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchStats(); // initial fetch

  const interval = setInterval(fetchStats, 5000); // refresh every 5 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, [axiosSecure]);


  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Public Lessons" value={stats.totalPublicLessons} />
        <StatCard title="Reported Lessons" value={stats.totalReportedLessons} />
        <StatCard title="Today’s Lessons" value={stats.todaysLessons} />
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-2 gap-6">
        <Graph title="Lesson Growth" data={lessonGrowth} />
        <Graph title="User Growth" data={userGrowth} />
      </div>

      {/* Active Contributors */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Top Contributors</h3>
        <ul className="list-disc pl-6">
          {stats.activeContributors?.map(user => (
            <li key={user._id}>
              {user._id} — {user.totalLessons} lessons
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-base-100 shadow p-4 rounded-xl text-center">
    <p className="text-gray-500">{title}</p>
    <p className="text-3xl font-bold">{value ?? 0}</p>
  </div>
);

const Graph = ({ title, data }) => (
  <div className="bg-base-100 shadow p-4 rounded-xl">
    <h3 className="font-semibold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Line dataKey="count" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default AdminOverview;
