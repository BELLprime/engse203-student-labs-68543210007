import { useState } from "react";

const initialForm = {
  title: "",
  category: "",
  priority: "normal",
};

function validateTask(formData) {
  const errors = {};
  if (formData.title.trim().length < 3) {
    errors.title = "ชื่องานต้องมีอย่างน้อย 3 ตัวอักษร";
  }
  if (!formData.category) {
    errors.category = "กรุณาเลือกหมวดหมู่";
  }
  return errors;
}

function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  //hadle event
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validateTask(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback("");
      return;
    }

    onAddTask(formData);
    //reset form + clear errors
    setFormData(initialForm);
    setErrors({});
    setFeedback("เพิ่มรายการสำเร็จ");
  }
  
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>เพิ่มงานใหม่</h2>
      {/* ---- Title ---- */}
      <div className="form-group">
        <label htmlFor="title">ชื่องาน : </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="field-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>
      {/* ---- Category ---- */}
      <div className="form-group">
        <label htmlFor="category">หมวดหมู่ : </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          aria-invalid={!!errors.category}
        >
          <option value="">— เลือกหมวดหมู่ —</option>
          <option value="reading">Reading</option>
          <option value="coding">Coding</option>
          <option value="review">Review</option>
        </select>
        {errors.category && (
          <p className="field-error" role="alert">
            {errors.category}
          </p>
        )}
      </div>
      {/* ---- Priority ---- */}
      <div className="form-group">
        <label htmlFor="priority">ความสำคัญ : </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
        </select>
      </div>
      <button type="submit">
        เพิ่มงาน
      </button>
    </form>
  );
}

export default TaskForm;
