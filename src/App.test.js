import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }) => <div>{children}</div>,
  GoogleMap: ({ children }) => <div>{children}</div>,
  Marker: () => <div>Marker</div>,
  Autocomplete: ({ children, onLoad }) => {
    const dummyAutocomplete = {
      getPlace: () => ({ formatted_address: 'Mock Address' })
    };
    onLoad(dummyAutocomplete);
    return <div>{children}</div>;
  },
  DirectionsRenderer: () => <div>DirectionsRenderer</div>
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { name: 'Carrier A', trucks_per_day: 10 },
          { name: 'Carrier B', trucks_per_day: 5 }
        ])
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  global.google = {
    maps: {
      TravelMode: { DRIVING: 'DRIVING' },
      DirectionsService: function () {
        this.route = (req, cb) =>
          cb(
            {
              geocoded_waypoints: [],
              request: req,
              routes: [
                {
                  summary: 'Mocked Route',
                  legs: [
                    {
                      duration: { text: '4 hours' },
                      distance: { text: '300 miles' }
                    }
                  ]
                }
              ]
            },
            'OK'
          );
      }
    }
  };
});


test('user searches for carriers and sees results', async () => {
  render(<App />);

  const fromInput = screen.getByPlaceholderText(/From/i);
  const toInput = screen.getByPlaceholderText(/To/i);
  const searchButton = screen.getByText(/Search/i);

  fireEvent.change(fromInput, { target: { value: 'New York' } });
  fireEvent.change(toInput, { target: { value: 'Washington DC' } });
  fireEvent.click(searchButton);

  await waitFor(() => {
    expect(screen.getByText(/Carrier A/)).toBeInTheDocument();
    expect(screen.getByText(/Carrier B/)).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
});
