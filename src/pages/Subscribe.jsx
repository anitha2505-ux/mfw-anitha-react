import React, { useState } from "react";

export default function Subscribe() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    interests: []
  });

  const [submitted, setSubmitted] = useState(false);

  function onChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value)
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) return;

    // For now, we just simulate submission
    console.log("Newsletter Subscription:", form);

    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      gender: "",
      interests: []
    });
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="border rounded p-4">
          <h2 className="mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-muted mb-4">
            Get updates on new pet care products, offers, and tips.
          </p>

          {/* Success message */}
          {submitted && (
            <div className="alert alert-success">
              Thank you for subscribing to our newsletter!
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Name */}
            <label className="form-label">Full Name</label>
            <input
              className="form-control mb-3"
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />

            {/* Email */}
            <label className="form-label">Email Address</label>
            <input
              className="form-control mb-3"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />

            {/* Gender (Radio buttons) */}
            <label className="form-label">Gender</label>
            <div className="mb-3">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={onChange}
                />
                <label className="form-check-label">Female</label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={onChange}
                />
                <label className="form-check-label">Male</label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value="Prefer not to say"
                  checked={form.gender === "Prefer not to say"}
                  onChange={onChange}
                />
                <label className="form-check-label">Prefer not to say</label>
              </div>
            </div>

            {/* Interests (Checkboxes) */}
            <label className="form-label">Interests</label>
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Dog Products"
                  checked={form.interests.includes("Dog Products")}
                  onChange={onChange}
                />
                <label className="form-check-label">Dog Products</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Cat Products"
                  checked={form.interests.includes("Cat Products")}
                  onChange={onChange}
                />
                <label className="form-check-label">Cat Products</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Pet Health & Wellness"
                  checked={form.interests.includes("Pet Health & Wellness")}
                  onChange={onChange}
                />
                <label className="form-check-label">Pet Health & Wellness</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Promotions & Discounts"
                  checked={form.interests.includes("Promotions & Discounts")}
                  onChange={onChange}
                />
                <label className="form-check-label">Promotions & Discounts</label>
              </div>
            </div>

            {/* Submit */}
            <button className="btn btn-primary w-100" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
