import { render, screen } from '@testing-library/react';
import ApplicationForm from '../ApplicationForm';

describe('ApplicationForm Component', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <ApplicationForm>
          <div data-testid="child-content">Test Content</div>
        </ApplicationForm>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('should render children content', () => {
      const testContent = 'Test form content';
      
      render(
        <ApplicationForm>
          <span>{testContent}</span>
        </ApplicationForm>
      );
      
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ApplicationForm>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ApplicationForm>
      );
      
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('should render complex children components', () => {
      render(
        <ApplicationForm>
          <form data-testid="form">
            <input type="text" placeholder="Test input" />
            <button type="submit">Submit</button>
          </form>
        </ApplicationForm>
      );
      
      expect(screen.getByTestId('form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });

});