import { render, screen, within, fireEvent } from '@testing-library/react';
import App from '../App';
import Sidebar from '../components/Sidebar.jsx';
import '@testing-library/jest-dom';

// Helper functions
const renderApp = () => render(<App />);
const getMainContainer = () => screen.getByTestId('main-container');
const clickSpaceLink = (spaceName) => fireEvent.click(screen.getByRole('link', { name: spaceName }));
const expectMainText = (text) => {
  const main = getMainContainer();
  const element = within(main).getByText(text);
  expect(element).toBeInTheDocument();
};

describe('App state and rendering', () => {
  test('initial state shows Queue', () => {
    renderApp();
    expect(screen.getByText("Stackly")).toBeInTheDocument();
    expectMainText("Queue");
  });

  test('clicking link updates Main to correct space', () => {
    renderApp();
    clickSpaceLink("HR");
    expectMainText("HR Space");
  });

  test('clicking same link again keeps the same space', () => {
    renderApp();
    clickSpaceLink("HR");
    expectMainText("HR Space");
    clickSpaceLink("HR");
    expectMainText("HR Space");
  });

  test('Space component shows correct text', () => {
    renderApp();
    clickSpaceLink("HR");
    const spaceContainer = screen.getByTestId('space-container');
    const element = within(spaceContainer).getByText("HR Space");
    expect(element).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  test('renders all space links', () => {
    render(<Sidebar />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });
});
