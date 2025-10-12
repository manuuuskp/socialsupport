import { render, screen } from '@testing-library/react';
import ModalWrapper from '../ModalWrapper';

describe('ModalWrapper Component', () => {
  const defaultProps = {
    title: 'Test Modal',
    description: 'This is a test modal description',
    children: <div data-testid="modal-content">Modal Content</div>,
  };

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      const modal = container.querySelector('.bg-white.rounded-lg');
      expect(modal).toBeInTheDocument();
    });

    it('should render modal title', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const title = screen.getByText('Test Modal');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });

    it('should render modal description', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const description = screen.getByText('This is a test modal description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('should render children content', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });
  });

  describe('Modal Structure', () => {
    it('should have proper header structure', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const title = screen.getByText('Test Modal');
      const description = screen.getByText('This is a test modal description');
      const header = title.parentElement;
      
      expect(header).toHaveClass('p-4', 'border-b');
      expect(header).toContainElement(title);
      expect(header).toContainElement(description);
    });
  });

  describe('Content Variations', () => {
    it('should render with different title', () => {
      const props = {
        ...defaultProps,
        title: 'Different Title',
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText('Different Title')).toBeInTheDocument();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should render with different description', () => {
      const props = {
        ...defaultProps,
        description: 'A completely different description for testing',
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText('A completely different description for testing')).toBeInTheDocument();
      expect(screen.queryByText('This is a test modal description')).not.toBeInTheDocument();
    });

    it('should render with different children', () => {
      const props = {
        ...defaultProps,
        children: (
          <div>
            <button>Action Button</button>
            <p>Different content</p>
          </div>
        ),
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText('Action Button')).toBeInTheDocument();
      expect(screen.getByText('Different content')).toBeInTheDocument();
      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });

    it('should render with complex children content', () => {
      const props = {
        ...defaultProps,
        children: (
          <div>
            <form>
              <input type="text" placeholder="Enter text" />
              <textarea placeholder="Enter description"></textarea>
              <div>
                <button type="submit">Submit</button>
                <button type="button">Cancel</button>
              </div>
            </form>
          </div>
        ),
      };
      
      render(<ModalWrapper {...props} />);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper title styling', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const title = screen.getByText('Test Modal');
      expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900');
    });

    it('should have proper description styling', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const description = screen.getByText('This is a test modal description');
      expect(description).toHaveClass('text-sm', 'text-gray-500', 'mt-1');
    });

    it('should have proper z-index for overlay', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('z-50');
    });

    it('should have proper backdrop styling', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('bg-black', 'bg-opacity-50');
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const modal = container.querySelector('.bg-white.rounded-lg');
      expect(modal).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ModalWrapper {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Modal');
    });
  });

  describe('Content Overflow', () => {
    it('should maintain layout with long content', () => {
      const longContent = 'Very long content that might cause layout issues. '.repeat(100);
      const props = {
        ...defaultProps,
        children: <div data-testid="long-content">{longContent}</div>,
      };
      
      const { container } = render(<ModalWrapper {...props} />);
      
      const modal = container.querySelector('.bg-white.rounded-lg');
      expect(modal).toBeInTheDocument();
      expect(screen.getByTestId('long-content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      const props = {
        ...defaultProps,
        title: '',
      };
      
      render(<ModalWrapper {...props} />);
      
      const heading = screen.queryByRole('heading', { level: 3 });
      expect(heading).not.toBeInTheDocument();
    });

    it('should handle empty description', () => {
      const props = {
        ...defaultProps,
        description: '',
      };
      
      render(<ModalWrapper {...props} />);
      
      const description =  screen.queryByText('', { selector: 'p' });
      expect(description).not.toBeInTheDocument();
    });

    it('should handle null children', () => {
      const props = {
        ...defaultProps,
        children: null,
      };
      
      const { container } = render(<ModalWrapper {...props} />);
      
      const modal = container.querySelector('.bg-white.rounded-lg');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const props = {
        ...defaultProps,
        children: undefined,
      };
      
      const { container } = render(<ModalWrapper {...props} />);
      
      const modal = container.querySelector('.bg-white.rounded-lg');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long modal title that might cause layout issues in some cases';
      const props = {
        ...defaultProps,
        title: longTitle,
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'This is a very long description that spans multiple lines and might cause layout issues. '.repeat(10);
      const props = {
        ...defaultProps,
        description: longDescription,
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'p' && content.includes('This is a very long description');
      })).toBeInTheDocument();
    });

    it('should handle special characters in title and description', () => {
      const props = {
        title: 'Title with special chars: <>{}[]!@#$%^&*()',
        description: 'Description with émojis 🎉 and unicode ñ characters',
        children: <div>Content</div>,
      };
      
      render(<ModalWrapper {...props} />);
      
      expect(screen.getByText('Title with special chars: <>{}[]!@#$%^&*()')).toBeInTheDocument();
      expect(screen.getByText('Description with émojis 🎉 and unicode ñ characters')).toBeInTheDocument();
    });
  });

  describe('Layout Positioning', () => {
    it('should center modal in viewport', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should take full viewport height', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('min-h-screen');
    });

    it('should be fixed positioned', () => {
      const { container } = render(<ModalWrapper {...defaultProps} />);
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('fixed', 'inset-0');
    });
  });
});