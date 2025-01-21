import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getToken } from '../../services/authServices';
import Header from '../../components/Header';
import DataTable from 'react-data-table-component';
import axiosInstance from '../../utils/axiosInstance'; 

const HistoryPage = () => {
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userRole = localStorage.getItem('role');
      setRole(userRole);

      axiosInstance
        .get('/api/material-requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setRequests(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  const handleViewRequest = (id) => {
    router.push(`/material-requests/view/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Approval':
        return <span className="badge bg-warning">Pending</span>;
      case 'Approved':
        return <span className="badge bg-success">Approved</span>;
      case 'Rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Deleted</span>;
    }
  };

  // Filter data yang ditampilkan
  const filteredRequests = requests.filter((request) => request.status !== 'Pending Approval');

  // Konfigurasi kolom untuk DataTable
  const columns = [
    {
      name: 'Request ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Project Name',
      selector: (row) => row.projectName,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.requesterId,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => getStatusBadgeClass(row.status),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <button
            className="btn btn-info m-1"
            onClick={() => handleViewRequest(row.id)}
          >
            View
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <Header username="User" role={role} />
      <div className="container mt-5">
        <h2>Material Requests</h2>
        <DataTable
          columns={columns}
          data={filteredRequests}
          pagination
          highlightOnHover
          defaultSortFieldId="id"
        />
      </div>
    </>
  );
};

export default HistoryPage;
