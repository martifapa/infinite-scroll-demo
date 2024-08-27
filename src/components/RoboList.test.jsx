import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, vi, afterEach, expect } from 'vitest';

import RoboList from './RoboList';
import { getRobots } from '../services/robots';


vi.mock('../services/robots');

// Mock IntersectionObserver
class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
  
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
  
    unobserve() {
      return null;
    }
  
    disconnect() {
      return null;
    }
  }
  
globalThis.IntersectionObserver = IntersectionObserver;
  

describe('RoboList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Render a list of (2) robots', async () => {
    const mockRobots = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_number: '123 456 789' },
      { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', phone_number: '987 654 321' },
    ];

    getRobots.mockResolvedValueOnce(mockRobots);

    render(<RoboList />);
    
    // Robots are rendered
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      });

    // Images are loaded
    mockRobots.forEach((robot) => {
      const imgUrl = `https://robohash.org/${robot.email}?gravatar=yes`;
      expect(screen.getByAltText(`${robot.first_name} ${robot.last_name} profile pic`)).toHaveAttribute('src', imgUrl);
    });
  });

  test('Load more robots when the last robot card is in view', async () => {
    const mockRobotsBatch1 = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_number: '123 456 789' },
    ];
    const mockRobotsBatch2 = [
      { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', phone_number: '987 654 321' },
    ];

    getRobots
      .mockResolvedValueOnce(mockRobotsBatch1)
      .mockResolvedValueOnce(mockRobotsBatch2); // Second call returns the second batch

    render(<RoboList />);

    // VFirst batch is rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate scrolling
    const lastCard = screen.getByText('John Doe');
    const observerCallback = vi.fn();

    // Simulate observing the last card
    observerCallback([{ isIntersecting: true, target: lastCard }]);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });
});
