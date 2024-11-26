import {
  vi,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import {
  MemoryRouter,
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import ProductModal from '@components/Product/Modal/ProductModal';
import useAppContext from '@contexts/App/useAppContext';
import usePurchaseContext from '@contexts/Purchase/usePurchaseContext';
import dispatchTrackingEvent from '@helpers/dispatchTrackingEvent';
import Modal from '@components/shared/Modal/Modal';
import ProductImage from '@components/Product/Image/ProductImage';
import Button from '@components/shared/Button/Button';
import LikeButton from '@components/shared/LikeButton/LikeButton';
import ShareButton from '@components/shared/ShareButton/ShareButton';
import SizePicker from '@components/shared/SizePicker/SizePicker';

vi.mock('@contexts/App/useAppContext');
vi.mock('@contexts/Purchase/usePurchaseContext');
vi.mock('@helpers/dispatchTrackingEvent');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});
vi.mock('@components/shared/Modal/Modal');
vi.mock('@components/Product/Image/ProductImage');
vi.mock('@components/shared/Button/Button');
vi.mock('@components/shared/LikeButton/LikeButton');
vi.mock('@components/shared/ShareButton/ShareButton');
vi.mock('@components/shared/SizePicker/SizePicker');

describe('ProductModal', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
    available: true,
    sizes: [0, 1, 2],
    sizeHint: 'Choose your size',
    description: 'Test description',
    feature: 'Sale',
  };

  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useAppContext.mockReturnValue({
      whitelabel: { shop: { name: 'Test Shop' } },
      products: [mockProduct],
    });

    usePurchaseContext.mockReturnValue({
      showPurchase: vi.fn(),
      findCartItem: vi.fn().mockReturnValue(null),
      addCartItem: vi.fn(),
      findWishListItem: vi.fn().mockReturnValue(null),
      addWishListItem: vi.fn(),
      removeWishListItem: vi.fn(),
    });

    useParams.mockReturnValue({ productId: '1', categorySlug: 'products' });
    useNavigate.mockReturnValue(mockNavigate);
    useSearchParams.mockReturnValue([new URLSearchParams()]);

    Modal.mockImplementation(({ children }) => <div>{children}</div>);
    ProductImage.mockImplementation(() => <img alt="product" />);
    Button.mockImplementation(({ children, onClick }) => (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    ));
    LikeButton.mockImplementation(({ liked, onLike }) => (
      <button type="button" onClick={onLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    ));
    ShareButton.mockImplementation(() => <button type="button">Share</button>);
    SizePicker.mockImplementation(() => <div>Size Picker</div>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders product details correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    expect(getByText(mockProduct.name)).toBeInTheDocument();
    expect(getByText('Артикул: 1')).toBeInTheDocument();
    expect(getByText(`${mockProduct.price} грн`)).toBeInTheDocument();
    expect(getByText(mockProduct.description)).toBeInTheDocument();
    expect(getByText('Size Picker')).toBeInTheDocument();
    expect(getByText('Like')).toBeInTheDocument();
    expect(getByText('Share')).toBeInTheDocument();
    expect(getByText('Sale')).toBeInTheDocument();
  });

  it('adds product to cart when "додати в кошик" is clicked', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    const addToCartButton = getByText('додати в кошик');
    await act(() => fireEvent.click(addToCartButton));

    expect(usePurchaseContext().addCartItem).toHaveBeenCalledWith({
      ...mockProduct,
      selectedSize: 0,
    });
    expect(dispatchTrackingEvent).toHaveBeenCalledWith({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'UAH',
        value: mockProduct.price,
        items: [
          {
            item_id: mockProduct.id,
            item_name: mockProduct.name,
            index: 0,
            price: mockProduct.price,
            quantity: 1,
          },
        ],
      },
    });
  });

  it('displays "немає в наявності" when product is unavailable', () => {
    useAppContext.mockReturnValue({
      whitelabel: { shop: { name: 'Test Shop' } },
      products: [{ ...mockProduct, available: false }],
    });

    const { getByText } = render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    expect(getByText('немає в наявності')).toBeInTheDocument();
  });

  it('toggles product in wishlist when "Like" button is clicked', () => {
    const addWishListItem = vi.fn();
    const removeWishListItem = vi.fn();
    const mockContext = {
      ...usePurchaseContext(),
      findWishListItem: vi.fn().mockReturnValue(null),
      addWishListItem,
      removeWishListItem,
    };

    usePurchaseContext.mockReturnValue(mockContext);

    const { getByText, rerender } = render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    const likeButton = getByText('Like');
    fireEvent.click(likeButton);
    expect(addWishListItem).toHaveBeenCalledWith(mockProduct);

    mockContext.findWishListItem.mockReturnValue(mockProduct);
    usePurchaseContext.mockReturnValue(mockContext);

    rerender(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('Unlike'));
    expect(removeWishListItem).toHaveBeenCalledWith(mockProduct.id);
  });

  it('dispatches "view_item" event when product is displayed', () => {
    render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    expect(dispatchTrackingEvent).toHaveBeenCalledWith({
      event: 'view_item',
      ecommerce: {
        currency: 'UAH',
        value: mockProduct.price,
        items: [
          {
            item_id: mockProduct.id,
            item_name: mockProduct.name,
            index: 0,
            price: mockProduct.price,
            quantity: 1,
          },
        ],
      },
    });
  });

  it('renders "додано в кошик" when product is already in the cart', () => {
    usePurchaseContext.mockReturnValue({
      findCartItem: vi.fn().mockReturnValue(mockProduct),
      addCartItem: vi.fn(),
      findWishListItem: vi.fn().mockReturnValue(null),
      addWishListItem: vi.fn(),
      removeWishListItem: vi.fn(),
    });

    const { getByText } = render(
      <MemoryRouter>
        <ProductModal />
      </MemoryRouter>,
    );

    expect(getByText('додано в кошик')).toBeInTheDocument();
  });
});
