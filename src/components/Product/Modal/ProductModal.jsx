import './ProductModal.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import useAppContext from '@contexts/App/useAppContext';
import ProductImage from '@components/Product/Image/ProductImage';
import Modal from '@components/shared/Modal/Modal';
import InfoHeader from '@components/Product/Modal/InfoHeader/InfoHeader';
import ActionButton from '@components/Product/Modal/ActionButton/ActionButton';
import SizePicker from '@components/shared/SizePicker/SizePicker';
import useProductNavigation from '@helpers/useProductNavigation';
import { trackViewItemEvent } from '@helpers/googleAnalyticsGA4';

function ProductModal() {
  const { products } = useAppContext();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(0);

  const navigate = useNavigate();
  const { getProductListLink } = useProductNavigation();
  const onClose = () => {
    setProduct(null);

    navigate(getProductListLink());
  };

  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (!productId) return;

    const selectedProduct = products.find((prod) => prod.id === Number(productId));
    if (!selectedProduct) return;

    setProduct(selectedProduct);

    const sizeParam = searchParams.get('size');
    if (!sizeParam) {
      setSelectedSize(0);
      return;
    }

    const availableSize = selectedProduct.sizes.find((size) => size === Number(sizeParam));
    if (availableSize) {
      setSelectedSize(availableSize);
    }
  }, [productId, products, searchParams]);

  useEffect(() => {
    if (product) {
      trackViewItemEvent(product);
    }
  }, [product]);

  return (
    product && (
      <Modal onClose={onClose} hiddenOverflow>
        <div className="product-modal__img-container">
          <ProductImage
            id={product.id}
            name={product.name}
            size="l"
            className="product-modal__img"
          />
        </div>
        <InfoHeader product={product} />
        {product.sizes.length > 0 && (
          <SizePicker
            sizes={product.sizes}
            setSize={setSelectedSize}
            selectedSize={selectedSize}
            disabled={false}
            sizeHint={product.sizeHint}
          />
        )}
        <ActionButton product={product} selectedSize={selectedSize} />
        <div className="product-modal__description">
          <span className="article">{`Артикул: ${product.id}`}</span>
          <p>{product.description}</p>
        </div>
      </Modal>
    )
  );
}

export default ProductModal;
