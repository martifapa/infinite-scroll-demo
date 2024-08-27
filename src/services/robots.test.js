import axios from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";

import { getRobots } from "./robots";


vi.mock('axios');

describe('getRobots', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('return data when successful API call', async () => {
        const mockData = [
            { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_number: '123 456 789'  },
            { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', phone_number: '987 654 321'  },
        ];

        axios.get.mockResolvedValue({ data: mockData });

        const result = await getRobots();

        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith('https://random-data-api.com/api/v2/users?size=100');
    });

    test('handle error when UNsuccessful API call', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        try {
            await getRobots();
        } catch (error) {
            expect(error.message).toBe('Network Error');
        }

        expect(axios.get).toHaveBeenCalledWith('https://random-data-api.com/api/v2/users?size=100');
    });
});