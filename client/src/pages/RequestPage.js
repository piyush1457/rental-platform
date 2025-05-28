import { useState } from 'react';
import axios from 'axios';

export default function RequestPage() {
  const [form, setForm] = useState({
    itemName: '', imageUrl: '', suggestedPrice: '', description: '', duration: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/api/request', form);
    alert('Request sent!');
  };

  return (
    <div>
      <h2>Request an Item</h2>
      <input name="itemName" placeholder="Item Name" onChange={handleChange} />
      <input name="imageUrl" placeholder="Image URL" onChange={handleChange} />
      <input name="suggestedPrice" placeholder="Suggested Price" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="duration" placeholder="Duration (e.g. 5 days)" onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
