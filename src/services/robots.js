import axios from "axios";


export const getRobots = async () => {
    const response = await axios.get('https://random-data-api.com/api/v2/users?size=100');
    return response.data;
};