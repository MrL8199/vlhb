import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import styles from './Page.module.css';
import PageLoader from '../PageLoader';

interface Props {
  className: string;
  children: React.ReactNode;
  loading: boolean;
  inner: boolean;
}
const Page: React.FC<Props> = ({ className, children, loading = false, inner = false }) => {
  const loadingStyle: CSSProperties = {
    height: 'calc(100vh - 184px)',
    overflow: 'hidden',
  };
  return (
    <div
      className={classnames(className, {
        [styles.contentInner]: inner,
      })}
      style={loading ? loadingStyle : undefined}
    >
      {loading ? <PageLoader /> : ''}
      {children}
    </div>
  );
};

export default Page;
