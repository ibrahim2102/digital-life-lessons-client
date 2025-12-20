// In useAxiosSecure.jsx - make sure it's properly set up
import axios from 'axios';


const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
});

const useAxiosSecure = () => {

    return axiosSecure;
};

export default useAxiosSecure;

