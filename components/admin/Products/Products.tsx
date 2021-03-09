import React, { useState, useEffect } from 'react';
import { Product, AddProduct as AddProductType } from 'types';
import { ProductService } from 'services';
import { ErrorMessage, Pagination, Spinner, Button, Modal } from 'components/ui';
import { FaTrash } from 'react-icons/fa';
import { formatPrice } from 'utils/helpers';
import { useToast } from 'contexts';
import styles from './Products.module.css';

const LIMIT = 10;

const Products: React.FC = () => {
  const { setToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpenAddProductModal, setIsOpenAddProductModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const payload = { params: { page, limit: LIMIT } };
        const results = await ProductService.fetchProducts(payload);
        setProducts(results.products);
        setTotal(results.total);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const onChangePaginate = (val: number) => {
    setPage(val);
  };

  const closeAddProductModal = () => {
    setIsOpenAddProductModal(false);
  };

  const openAddProductModal = () => {
    setIsOpenAddProductModal(true);
  };

  const handleAddProduct = async (newProduct: AddProductType) => {
    try {
      const { product } = await ProductService.addProduct(newProduct);
      setProducts([product, ...products]);
    } catch (error) {
      setToast('error', error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const isConfirm = window.confirm('Are you sure you want to delete this product?');
      if (!isConfirm) return;
      await ProductService.deleteProduct(id);
      const filterProducts = products.filter((product) => product.id !== id);
      setProducts(filterProducts);
      setToast('success', 'Successfully deleted');
    } catch (error) {
      setToast('error', error.message);
    }
  };

  if (loading) {
    return <Spinner size={60} />;
  }

  if (error) {
    return <ErrorMessage message="Unable to get products right now please try again later." />;
  }

  return (
    <div className="table-container">
      <Modal
        visible={isOpenAddProductModal}
        title="Add Product"
        onClose={closeAddProductModal}
      ></Modal>
      <div className={styles.addProductContainer}>
        <Button title="Thêm" onClick={openAddProductModal} />
      </div>
      {products.length === 0 ? (
        <div className={styles.msg}> No products created yet. </div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '30rem' }}> Product </th>
                <th> Price </th>
                <th style={{ width: '20rem' }}> Description </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <a href={`/product?id=${product.id}`} target="_blank" rel="noreferrer">
                      <div className={styles.productInfo}>
                        <img src={product.images[0]} alt={product.title} />
                        <div className={styles.name}> {product.title} </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <div className={styles.price}>{formatPrice(product.price)}</div>
                  </td>
                  <td>
                    <div className={styles.desc}>{product.quotes_about}</div>
                  </td>
                  <td>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination limit={LIMIT} onChange={onChangePaginate} total={total} active={page} />
        </>
      )}
    </div>
  );
};

export default Products;
