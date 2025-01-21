import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/sweetalert2/dist/sweetalert2.min.css';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      if (!token) {
        // Jika token tidak ada, arahkan ke halaman login
        router.push('/login');
      }
    };

    // Periksa token hanya jika halaman bukan login
    if (router.pathname !== '/login') {
      checkAuth();
    }
  }, [router]);

  return <Component {...pageProps} />;
}
