// In useAxiosSecure.jsx - make sure it's properly set up
import axios from 'axios';


const axiosSecure = axios.create({
    baseURL: 'https://digital-life-lessons-server-virid.vercel.app'
});

const useAxiosSecure = () => {

    return axiosSecure;
};

export default useAxiosSecure;

