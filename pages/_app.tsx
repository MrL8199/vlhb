import React from 'react';
import App, { AppProps, AppContext } from 'next/app';
import { StoreProvider } from 'contexts';
import { parseCookies, destroyCookie } from 'nookies';
import { checkProtectedRoutes, redirectUser } from 'utils/auth';
import { AuthService } from 'services/authService';
import AdminLayout from 'components/layouts';
import { User } from 'types';
import 'styles/global.css';
import moment from 'moment';

moment.locale('vi');

interface MyAppProps extends AppProps {
  currentUser: User | null;
}

const MyApp = ({ Component, pageProps, currentUser }: MyAppProps): JSX.Element => {
  return (
    <StoreProvider currentUser={currentUser}>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </StoreProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { token } = parseCookies(appContext.ctx);

  const isServer = appContext.ctx.req;
  const ctx = appContext.ctx;

  if (!token) {
    checkProtectedRoutes(ctx);
    return { ...appProps };
  }

  let currentUser: User | null = null;

  if (isServer) {
    try {
      const { user } = await AuthService.getMe(token);
      currentUser = user;
      if (!currentUser.is_admin) throw Error('Không có quyền');
      if (ctx.pathname === '/login') redirectUser(ctx, '/');
    } catch (error) {
      destroyCookie(ctx, 'token');
      checkProtectedRoutes(ctx);
    }
  }

  return { ...appProps, currentUser };
};

export default MyApp;
