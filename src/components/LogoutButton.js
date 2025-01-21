import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin mau Logout?',
      text: "Anda akan kembali ke halaman Login.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus token dari localStorage
        localStorage.removeItem('token');
        
        // Redirect ke halaman login
        router.push('/login');
        
        Swal.fire(
          'Logged out!',
          'Kamu telah Logout, sampai jumpa lagi.',
          'success'
        );
      }
    });
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default LogoutButton;
