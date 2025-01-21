import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken } from "../../../services/authServices";
import Header from "../../../components/Header";
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import axiosInstance from '../../../utils/axiosInstance'; // Impor axios instance

const ViewMaterialRequest = () => {
  const router = useRouter();
  const { id } = router.query; // Get ID from URL
  const [materialRequest, setMaterialRequest] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (id) {
      const token = getToken();
      axiosInstance
        .get(`api/material-requests/${id}/view`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMaterialRequest(response.data.materialRequest);
          setItems(response.data.items);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching material request:", error);
          setLoading(false);
        });
    }
  }, []);

  const handleDeleteRequest = () => {
    Swal.fire({
      title: "Apakah Anda yakin delete?",
      text: "Aksi delete tidak dapat diulang!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = getToken();
        axiosInstance
          .post(
            `api/material-requests/${id}/delete`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            Swal.fire("Deleted!", "Material Request berhasil di delete.", "success");
            router.push("/material-requests");
          })
          .catch(() => {
            Swal.fire("Error!", "Terjadi kesalahan saat delete.", "error");
          });
      }
    });
  };

  const handleApproveRequest = () => {
    Swal.fire({
      title: "Apakah Anda yakin approve?",
      text: "Aksi ini akan approve Material Request.",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, approve!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = getToken();
        axiosInstance
          .post(
            `api/material-requests/${id}/approve`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            Swal.fire("Approved!", "Material Request sudah di approve.", "success");
            router.push("/material-requests");
          })
          .catch(() => {
            Swal.fire("Error!", "Terjadi kesalahan saat approve.", "error");
          });
      }
    });
  };

  const handleRejectRequest = () => {
    Swal.fire({
      title: "Apakah Anda yakin reject?",
      input: "textarea",
      inputLabel: "Mohon masukkan alasan reject..",
      inputPlaceholder: "Masukkan alasan reject...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      preConfirm: (rejectionReason) => {
        if (!rejectionReason || rejectionReason.trim() === "") {
          Swal.showValidationMessage("Anda harus memasukkan alasan Reject");
          return false;
        }

        const token = getToken();
        return axiosInstance
          .post(
            `api/material-requests/${id}/reject`,
            rejectionReason,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "text/plain" },
            }
          )
          .then(() => {
            Swal.fire("Rejected!", "The material request has been rejected.", "success");
            router.push("/material-requests");
          })
          .catch(() => {
            Swal.fire("Error!", "An error occurred while rejecting the request.", "error");
          });
      },
    });
  };

  const handleBackToList = () => {
    if (materialRequest.status === "Pending Approval") {
      router.push("/material-requests");
    } else {
      router.push("/history");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!materialRequest) {
    return <p>Material Request not found.</p>;
  }

  // Define columns for DataTable
  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Material Name',
      selector: row => row.materialName,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: row => row.quantity,
      sortable: true,
    },
    {
      name: 'Usage',
      selector: row => row.usageDescription,
      sortable: true,
    },
  ];

  return (
    <>
      <Header username="User" role={role} />
      <div className="container mt-5">
        <h2>Material Request Details</h2>
        <div className="card p-3 mt-4">
          <p>
            <strong>Request ID:</strong> {materialRequest.id}
          </p>
          <p>
            <strong>Project Name:</strong> {materialRequest.projectName}
          </p>
          <p>
            <strong>Requester:</strong> {materialRequest.requesterId}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(materialRequest.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                materialRequest.status === "Pending Approval"
                  ? "bg-warning"
                  : materialRequest.status === "Approved"
                  ? "bg-success"
                  : materialRequest.status === "Rejected"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}
            >
              {materialRequest.status}
            </span>
          </p>

          {/* Display rejection reason if status is "Rejected" */}
          {materialRequest.status === "Rejected" && (
            <p>
              <strong>Rejection Reason:</strong> {materialRequest.rejectedReason}
            </p>
          )}
        </div>

        <h3 className="mt-5">Items</h3>
        <DataTable
          title="Material Request Items"
          columns={columns}
          data={items}
          pagination
          responsive
        />

        {materialRequest.status === "Pending Approval" && role === "Production" && (
          <button
            className="btn btn-danger m-1"
            onClick={handleDeleteRequest}
          >
            Delete
          </button>
        )}

        {materialRequest.status === "Pending Approval" && role === "Warehouse" && (
          <>
            <button
              className="btn btn-success m-1"
              onClick={handleApproveRequest}
            >
              Approve
            </button>
            <button
              className="btn btn-warning m-1"
              onClick={handleRejectRequest}
            >
              Reject
            </button>
          </>
        )}

        <button
          className="btn btn-secondary m-1"
          onClick={handleBackToList}
        >
          Back to List
        </button>
      </div>
    </>
  );
};

export default ViewMaterialRequest;
