import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import WishListIcon from '@features/WishList/Icon/WishListIcon';
import usePurchaseContext from '@contexts/Purchase/usePurchaseContext';

vi.mock('@assets/heart.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="heart-icon" />,
}));

vi.mock('@assets/heart-fill.svg', () => ({
  __esModule: true,
  default: () => <svg data-testid="heart-fill-icon" />,
}));

vi.mock('@contexts/Purchase/usePurchaseContext');

describe('WishListIcon', () => {
  const mockOnClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('wishlist is empty', () => {
    usePurchaseContext.mockReturnValue({
      getWishList: () => [],
    });

    const { getByTestId } = render(<WishListIcon onClick={mockOnClick} />);

    expect(getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('wishlist has items', () => {
    usePurchaseContext.mockReturnValue({
      getWishList: () => [{ id: 1, name: 'Sample Item' }],
    });

    const { getByTestId } = render(<WishListIcon onClick={mockOnClick} />);

    expect(getByTestId('heart-fill-icon')).toBeInTheDocument();
  });

  it('onClick', () => {
    usePurchaseContext.mockReturnValue({
      getWishList: () => [],
    });

    const { getByRole } = render(<WishListIcon onClick={mockOnClick} />);
    const button = getByRole('button');

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
