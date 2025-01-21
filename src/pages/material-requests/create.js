import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getToken } from '../../services/authServices';
import Header from '../../components/Header';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axiosInstance from '@/utils/axiosInstance';

const CreateMaterialRequest = () => {
  const [projectName, setProjectName] = useState(''); // Tambahkan state untuk Project Name
  const [items, setItems] = useState([{ material_name: '', quantity: '', usage_description: '' }]);
  const [role, setRole] = useState('Production');
  const router = useRouter();

  const addItem = () => {
    setItems([...items, { material_name: '', quantity: '', usage_description: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Bisa Hapus Baris Terakhir',
        text: 'Sedikitnya harus ada 1 Item yang di Request.',
      });
      return;
    }

    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleBack = () => {
    router.push(`/material-requests`);
  };

  const handleSubmitRequest = async () => {
    const token = getToken();

    if (!projectName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Project Name Kosong',
        text: 'Mohon masukkan nama proyek.',
      });
      return;
    }

    let invalidFields = [];
    items.forEach((item, index) => {
      if (!item.material_name) invalidFields.push(`Material Name at row ${index + 1}`);
      if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) invalidFields.push(`Quantity at row ${index + 1}`);
      if (!item.usage_description) invalidFields.push(`Usage Description at row ${index + 1}`);
    });

    if (invalidFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: `Mohon isikan data berikut :\n${invalidFields.join(', ')}`,
      });
      return;
    }

    if (token) {
      try {
        const userId = 3; // Contoh ID pengguna, sesuaikan dengan decoding JWT Anda.

        const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Anda akan mengirim permintaan material ini!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Kirim',
          cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
          const materialRequestData = {
            projectName, // Sertakan Project Name
            requesterId: userId,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: items.map(item => ({
              materialName: item.material_name,
              quantity: parseInt(item.quantity, 10),
              usageDescription: item.usage_description,
            })),
          };

          const response = await axiosInstance.post('api/material-requests', materialRequestData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 201) {
            Swal.fire({
              icon: 'success',
              title: 'Permintaan Terkirim',
              text: 'Permintaan material Anda telah berhasil dibuat!',
            });

            router.push('/material-requests');
          } else {
            throw new Error('Unexpected response from server');
          }
        }
      } catch (error) {
        console.error('Failed to create request:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat membuat permintaan material. Silakan coba lagi.',
        });
      }
    }
  };

  return (
    <>
      <Header username="Production User" role={role} />
      <div className="container mt-5">
        <h2 className='mb-2'>Create New Material Request</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Input untuk Project Name */}
          <div className="mb-3">
            <label className="form-label mb-2">Project Name</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          {items.map((item, index) => (
            <div key={index} className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="material_name"
                  placeholder="Material Name"
                  value={item.material_name}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
              <div className="col">
                <textarea
                  className="form-control"
                  name="usage_description"
                  placeholder="Usage Description"
                  value={item.usage_description}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary m-1" onClick={handleBack}>
              Back to List
            </button>
            <button type="button" className="btn btn-info m-1" onClick={addItem}>
              Add Item
            </button>
            <button type="button" className="btn btn-primary m-1" onClick={handleSubmitRequest}>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateMaterialRequest;
