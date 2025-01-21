import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getToken } from '../../services/authServices';
import Header from '../../components/Header';
import Swal from 'sweetalert2'; // Import SweetAlert2
import DataTable from 'react-data-table-component'; // Import DataTable
import axiosInstance from '@/utils/axiosInstance';

const MaterialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userRole = localStorage.getItem('role');
      setRole(userRole);

      axiosInstance
        .get('api/material-requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setRequests(response.data);
        });
    }
  }, []);

  const handleCreateNewRequest = () => {
    router.push('/material-requests/create');
  };

  const handleDeleteRequest = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin Delete?',
      text: 'Jika delete, akan terhapus Permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .post(`api/material-requests/${id}/delete`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
          .then(() => {
            setRequests(requests.filter((request) => request.id !== id));
            Swal.fire('Deleted!', 'Material Request berhasil di delete.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'Terjadi kesalahan saat delete Material Request.', 'error');
          });
      }
    });
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin approve request ini?',
      text: 'Aksi ini akan approve semua Material Request Items.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Approve!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .post(`api/material-requests/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${getToken()}` },
          })
          .then(() => {
            setRequests(requests.filter((request) => request.id !== id)); // Perbarui tampilan daftar
            Swal.fire('Approved!', 'Material Request berhasil di Approve.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'Terjadi kesalahan saat approve Material Request.', 'error');
          });
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin akan reject request ini?',
      input: 'textarea',
      inputLabel: 'Masukkan alasan reject',
      inputPlaceholder: 'Masukkan alasan disini...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      preConfirm: (rejectionReason) => {
        if (!rejectionReason || rejectionReason.trim() === '') {
          Swal.showValidationMessage('Anda harus memasukkan alasan reject..');
          return false;
        }
        return axiosInstance
          .post(
            `api/material-requests/${id}/reject`,
            rejectionReason,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'text/plain',
              },
            }
          )
          .then(() => {
            setRequests(requests.filter((request) => request.id !== id));
            Swal.fire('Rejected!', 'Material Request berhasil di reject.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'Terjadi kesalahan saat reject Material Request.', 'error');
          });
      },
    });
  };

  const handleViewRequest = (id) => {
    router.push(`/material-requests/view/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Approval':
        return 'badge bg-warning';
      case 'Approved':
        return 'badge bg-success';
      case 'Rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const filteredRequests = requests.filter((request) => request.status === 'Pending Approval');

  // Defining columns for DataTable with custom widths
  const columns = [
    {
      name: 'Request ID',
      selector: row => row.id,
      sortable: true,
      width: '150px', // Fixed width for Request ID column
    },
    {
      name: 'Project Name',
      selector: row => row.projectName,
      sortable: true,
      width: '200px', // Fixed width for Project Name column
    },
    {
      name: 'Created By',
      selector: row => row.requesterId,
      sortable: true,
      width: '150px', // Fixed width for Created By column
    },
    {
      name: 'Created At',
      selector: row => formatDate(row.createdAt),
      sortable: true,
      width: '150px', // Fixed width for Created At column
    },
    {
      name: 'Status',
      cell: (row) => (
        <span className={getStatusBadgeClass(row.status)}>
          {row.status}
        </span>
      ),
      sortable: true,
      width: '100px', // Small width for Status column
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            className="btn btn-info btn-sm"
            onClick={() => handleViewRequest(row.id)}
          >
            View
          </button>
          {role === 'Warehouse' && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleApprove(row.id)}
              >
                Approve
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleReject(row.id)}
              >
                Reject
              </button>
            </>
          )}
          {role === 'Production' && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteRequest(row.id)}
            >
              Delete
            </button>
          )}
        </div>
      ),
      width: '300px', // Wider width for Actions column
    },
  ];

  return (
    <>
      <Header username="User" role={role} />
      <div className="container mt-5">
        <h2>Material Requests</h2>
        {role === 'Production' && (
          <button className="btn btn-primary mb-3" onClick={handleCreateNewRequest}>
            Create New Material Request
          </button>
        )}
        <DataTable
          title="Material Requests"
          columns={columns}
          data={filteredRequests}
          pagination
          responsive
        />
      </div>
    </>
  );
};

export default MaterialRequests;
