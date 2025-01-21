import React, { useState } from 'react';

const MaterialRequestForm = ({ onSubmit }) => {
  const [name, setName] = useState(''); // State untuk nama proyek
  const [items, setItems] = useState([{ item: '', quantity: '' }]);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Project Name is required!');
      return;
    }
    onSubmit({ name, items });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Material Request Form</h3>
      
      {/* Input untuk nama proyek */}
      <div className="mb-3">
        <label className="form-label">Project Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <h4>Add Material Items</h4>
      {items.map((item, index) => (
        <div key={index} className="mb-3">
          <label className="form-label">Item {index + 1}</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Enter item name"
              value={item.item}
              onChange={(e) => handleChange(index, 'item', e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control ms-2"
              placeholder="Enter quantity"
              value={item.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>
        Add More Items
      </button>
      <button type="submit" className="btn btn-primary">
        Submit Request
      </button>
    </form>
  );
};

export default MaterialRequestForm;
