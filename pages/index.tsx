import React, { useState, useEffect } from 'react';
import { Spinner, Button, Heading, Container } from 'components/ui';
import { MobileBottomMenu } from 'components/core';
import { useShop } from 'contexts';
import { GetServerSideProps } from 'next';
import { CategoryService } from 'services';
import { Category } from 'types';
import { useScrollRestoration } from 'hooks';
import { colors } from 'utils/theme';
import styles from 'styles/Home.module.css';

interface Props {
  categories: Category[];
}

const Home: React.FC<Props> = ({ categories }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { isLoading, loadProducts, hasLoadMore, products } = useShop();

  useEffect(() => {
    // load products if empty
    products.length === 0 && loadProducts();
  }, []);

  useScrollRestoration();

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadProducts();
    setIsLoadingMore(false);
  };

  const showLoadMore = () => {
    return !isLoading && hasLoadMore && !isLoadingMore;
  };

  return (
    <>
      <Container className={styles.container}>
        <Heading>Shop Categories</Heading>
        <Heading>Product Overview</Heading>
        {isLoadingMore && (
          <div className={styles.loadingWrapper}>
            <Spinner color={colors.primary} size={30} />
          </div>
        )}

        {showLoadMore() && (
          <div className={styles.loadMore}>
            <Button
              title="Load More"
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
              type="button"
              variant="outline"
            />
          </div>
        )}

        {!hasLoadMore && (
          <div className={styles.reachedEnd}>No more products. You have reached the end.</div>
        )}
      </Container>
      <MobileBottomMenu />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { categories } = await CategoryService.getCategories();

  return {
    props: { categories },
  };
};

export default Home;
