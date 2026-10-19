import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../axios'

const CheckOutAddress = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setform] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home', // Home, Work, Other
  })

  const [saving, setSaving] = useState(false)

  // Fetch Existing Saved Addresses
  const loadAddresses = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await api.get(`/address/${userId}`)
      let fetchedAddresses = []

      if (Array.isArray(res.data)) {
        fetchedAddresses = res.data
      } else if (res.data?.address) {
        fetchedAddresses = Array.isArray(res.data.address)
          ? res.data.address
          : [res.data.address]
      } else if (res.data && typeof res.data === 'object' && res.data._id) {
        fetchedAddresses = [res.data]
      }

      setAddresses(fetchedAddresses)

      if (fetchedAddresses.length > 0) {
        setSelectedAddressId(fetchedAddresses[0]._id || fetchedAddresses[0].id)
      } else {
        setIsFormOpen(true) // First time user: Automatically open form
      }
    } catch (error) {
      console.log('No previous address found or failed to load:', error)
      setIsFormOpen(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const handleChange = (event) => {
    const { name, value } = event.target
    setform((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleEdit = (addr) => {
    setform({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine: addr.addressLine || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      addressType: addr.addressType || 'Home',
    })
    setEditingId(addr._id || addr.id)
    setIsFormOpen(true)
  }

  const resetForm = () => {
    setform({
      fullName: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'Home',
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const saveAddress = async (event) => {
    event.preventDefault()

    if (!userId) {
      toast.info('Please log in to save your delivery address')
      navigate('/login')
      return
    }

    const trimmedForm = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      addressType: form.addressType || 'Home',
    }

    if (Object.values(trimmedForm).some((value) => !value)) {
      toast.error('Please fill in all address fields')
      return
    }

    if (!/^[0-9]{10}$/.test(trimmedForm.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    if (!/^[0-9]{6}$/.test(trimmedForm.pincode)) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }

    if (saving) return

    try {
      setSaving(true)

      const payload = { ...trimmedForm, userId }

      if (editingId) {
        await api.put(`/address/update/${editingId}`, payload)
        toast.success('Address updated successfully')
      } else {
        await api.post('/address/saveAddress', payload)
        toast.success('Delivery address saved successfully')
      }

      resetForm()
      loadAddresses()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to save address. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id)
  }

  const proceedWithSelectedAddress = () => {
    if (!selectedAddressId) {
      toast.error('Please select an address to proceed')
      return
    }
    const selected = addresses.find((a) => (a._id || a.id) === selectedAddressId)
    if (selected) {
      localStorage.setItem('selectedAddress', JSON.stringify(selected))
    }
    navigate('/checkout')
  }

  const fields = [
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter recipient full name',
      icon: '👤',
      autoComplete: 'name',
      maxLength: 100,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: '10-digit mobile number',
      icon: '📱',
      type: 'tel',
      autoComplete: 'tel',
      maxLength: 10,
    },
    {
      name: 'addressLine',
      label: 'House / Street Address',
      placeholder: 'House no., street, area, landmark',
      icon: '🏠',
      autoComplete: 'street-address',
      maxLength: 250,
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter your city',
      icon: '🌆',
      autoComplete: 'address-level2',
      maxLength: 100,
    },
    {
      name: 'state',
      label: 'State',
      placeholder: 'Enter your state',
      icon: '📍',
      autoComplete: 'address-level1',
      maxLength: 100,
    },
    {
      name: 'pincode',
      label: 'PIN Code',
      placeholder: '6-digit PIN code',
      icon: '📮',
      type: 'text',
      autoComplete: 'postal-code',
      maxLength: 6,
    },
  ]

  return (
    <div className="address-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .address-page {
          min-height: 100vh;
          padding: 28px 0 60px;
          background: #f7f8fa;
          color: #171717;
          font-family: inherit;
        }

        .address-container {
          width: min(1050px, calc(100% - 48px));
          margin: 0 auto;
        }

        .address-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          color: #737373;
          font-size: 13px;
        }

        .address-breadcrumb a {
          color: #737373;
          text-decoration: none;
        }

        .address-breadcrumb a:hover {
          color: #8a6a3f;
        }

        .address-layout {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
          overflow: hidden;
          border: 1px solid #ededed;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 10px 36px rgba(0,0,0,.045);
        }

        .address-intro {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100%;
          overflow: hidden;
          padding: 38px 32px;
          background:
            radial-gradient(ellipse at 80% 15%, rgba(180,143,89,.30), transparent 38%),
            linear-gradient(145deg, #171717, #34302a);
          color: #fff;
        }

        .address-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 750;
          letter-spacing: -.3px;
        }

        .address-brand-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 12px;
          background: rgba(255,255,255,.08);
          font-size: 21px;
        }

        .address-intro-copy {
          position: relative;
          z-index: 1;
          margin: 45px 0;
        }

        .address-kicker {
          display: block;
          margin-bottom: 14px;
          color: #e6c99d;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .address-intro h1 {
          margin: 0 0 16px;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .address-intro-copy p {
          margin: 0;
          color: #d4d4d4;
          font-size: 14px;
          line-height: 1.9;
        }

        .address-benefits {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .address-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f0f0f0;
          font-size: 12px;
        }

        .address-benefit-icon {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 35px;
          height: 35px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 10px;
          background: rgba(255,255,255,.07);
          font-size: 16px;
        }

        .address-form-panel {
          min-width: 0;
          padding: 38px;
        }

        .address-form-heading {
          margin-bottom: 24px;
        }

        .address-form-heading h2 {
          margin: 0 0 9px;
          font-size: 25px;
          letter-spacing: -.7px;
        }

        .address-form-heading p {
          margin: 0;
          color: #737373;
          font-size: 13px;
          line-height: 1.7;
        }

        /* Saved Addresses Section */
        .saved-addresses-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .saved-address-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e3e3e3;
          border-radius: 14px;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .saved-address-card:hover {
          border-color: #a8895d;
        }

        .saved-address-card.selected {
          border-color: #047857;
          background: #f0fdf4;
        }

        .address-radio {
          margin-top: 3px;
          accent-color: #047857;
        }

        .address-card-content {
          flex: 1;
        }

        .address-tag {
          display: inline-block;
          padding: 2px 8px;
          margin-bottom: 6px;
          border-radius: 6px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .address-card-name {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .address-card-text {
          color: #555;
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 4px;
        }

        .address-card-phone {
          color: #777;
          font-size: 12px;
        }

        .address-edit-btn {
          border: none;
          background: transparent;
          color: #8a6a3f;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .add-new-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          border: 2px dashed #a8895d;
          border-radius: 12px;
          background: #fcf8f2;
          color: #8a6a3f;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 20px;
        }

        .add-new-btn:hover {
          background: #f5ece0;
        }

        /* Type selector */
        .type-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .type-btn {
          flex: 1;
          padding: 9px;
          border: 1px solid #e3e3e3;
          border-radius: 8px;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-btn.active {
          border-color: #1d1d1d;
          background: #1d1d1d;
          color: #fff;
        }

        .address-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 19px 15px;
        }

        .address-field {
          min-width: 0;
        }

        .address-field.full-width {
          grid-column: 1 / -1;
        }

        .address-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-size: 12px;
          font-weight: 700;
        }

        .address-input-wrap {
          position: relative;
        }

        .address-input-icon {
          position: absolute;
          top: 50%;
          left: 13px;
          transform: translateY(-50%);
          font-size: 15px;
          pointer-events: none;
        }

        .address-input {
          display: block;
          width: 100%;
          min-width: 0;
          height: 48px;
          padding: 0 13px 0 40px;
          border: 1px solid #e3e3e3;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #171717;
          font: inherit;
          font-size: 13px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .address-input::placeholder {
          color: #a3a3a3;
        }

        .address-input:focus {
          border-color: #a8895d;
          box-shadow: 0 0 0 3px rgba(168,137,93,.12);
        }

        .address-form-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 27px;
        }

        .address-save-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
          min-height: 49px;
          padding: 12px 16px;
          border: none;
          border-radius: 11px;
          background: #1d1d1d;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }

        .address-save-button:hover:not(:disabled) {
          background: #8a6a3f;
        }

        .address-save-button:active:not(:disabled) {
          transform: scale(.99);
        }

        .address-save-button:disabled {
          cursor: not-allowed;
          opacity: .6;
        }

        .address-cancel-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 49px;
          padding: 12px 16px;
          border: 1px solid #e3e3e3;
          border-radius: 11px;
          background: #fff;
          color: #333;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: background .2s ease;
        }

        .address-cancel-button:hover {
          background: #f7f7f7;
        }

        .address-form-note {
          margin: 20px 0 0;
          color: #888;
          font-size: 11px;
          line-height: 1.7;
        }

        .address-form-note span {
          margin-right: 5px;
        }

        @media (max-width: 800px) {
          .address-layout {
            grid-template-columns: minmax(0, .75fr) minmax(0, 1.25fr);
          }

          .address-intro {
            padding: 30px 23px;
          }

          .address-form-panel {
            padding: 30px 24px;
          }

          .address-intro h1 {
            font-size: 29px;
          }

          .address-fields {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }

          .address-field.full-width {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .address-page {
            padding-top: 18px;
          }

          .address-container {
            width: calc(100% - 28px);
          }

          .address-breadcrumb {
            margin-bottom: 16px;
            font-size: 12px;
          }

          .address-layout {
            grid-template-columns: minmax(0, 1fr);
            border-radius: 17px;
          }

          .address-intro {
            min-height: auto;
            padding: 24px;
          }

          .address-brand-icon {
            width: 35px;
            height: 35px;
          }

          .address-intro-copy {
            margin: 28px 0 22px;
          }

          .address-intro h1 {
            max-width: 360px;
            margin-bottom: 10px;
            font-size: 29px;
          }

          .address-intro-copy p {
            font-size: 13px;
            line-height: 1.7;
          }

          .address-benefits {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .address-benefit {
            align-items: flex-start;
            gap: 8px;
            font-size: 10px;
            line-height: 1.5;
          }

          .address-benefit-icon {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }

          .address-form-panel {
            padding: 25px 20px;
          }

          .address-form-heading {
            margin-bottom: 22px;
          }

          .address-form-heading h2 {
            font-size: 23px;
          }

          .address-fields {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 12px;
          }

          .address-field.full-width {
            grid-column: 1 / -1;
          }

          .address-input {
            height: 46px;
            padding-left: 36px;
            font-size: 12px;
          }

          .address-input-icon {
            left: 11px;
            font-size: 14px;
          }

          .address-form-footer {
            flex-direction: column;
            align-items: stretch;
            margin-top: 23px;
          }

          .address-save-button,
          .address-cancel-button {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .address-benefits {
            grid-template-columns: minmax(0, 1fr);
          }

          .address-form-panel {
            padding: 22px 15px;
          }

          .address-fields {
            grid-template-columns: minmax(0, 1fr);
          }

          .address-field.full-width {
            grid-column: auto;
          }

          .address-form-footer {
            gap: 9px;
          }
        }
      `}</style>

      <div className="address-container">
        <nav className="address-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/user/cart">Cart</Link>
          <span>/</span>
          <Link to="/checkout">Checkout</Link>
          <span>/</span>
          <span>Delivery Address</span>
        </nav>

        <main className="address-layout">
          <section className="address-intro">
            <div className="address-brand">
              <span className="address-brand-icon">🛍️</span>
              <span>Apna Store</span>
            </div>

            <div className="address-intro-copy">
              <span className="address-kicker">Delivery details</span>
              <h1>Where should we deliver your order?</h1>
              <p>
                Add or select your delivery address so your favourite products
                can reach you smoothly.
              </p>
            </div>

            <div className="address-benefits">
              <div className="address-benefit">
                <span className="address-benefit-icon">📍</span>
                <span>Accurate delivery information</span>
              </div>

              <div className="address-benefit">
                <span className="address-benefit-icon">🔒</span>
                <span>Your details stay with your account</span>
              </div>

              <div className="address-benefit">
                <span className="address-benefit-icon">📦</span>
                <span>Ready for your next order</span>
              </div>
            </div>
          </section>

          <section className="address-form-panel">
            <div className="address-form-heading">
              <h2>Delivery Address</h2>
              <p>
                {isFormOpen
                  ? 'Enter address details below.'
                  : 'Select an existing address or add a new one.'}
              </p>
            </div>

            {loading ? (
              <p>Loading address information...</p>
            ) : !isFormOpen && addresses.length > 0 ? (
              <>
                <div className="saved-addresses-list">
                  {addresses.map((addr) => {
                    const id = addr._id || addr.id
                    const isSelected = selectedAddressId === id

                    return (
                      <div
                        key={id}
                        className={`saved-address-card ${
                          isSelected ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectAddress(id)}
                      >
                        <input
                          type="radio"
                          className="address-radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => handleSelectAddress(id)}
                        />
                        <div className="address-card-content">
                          <span className="address-tag">
                            {addr.addressType || 'Home'}
                          </span>
                          <div className="address-card-name">
                            {addr.fullName}
                          </div>
                          <div className="address-card-text">
                            {addr.addressLine}, {addr.city}, {addr.state} -{' '}
                            {addr.pincode}
                          </div>
                          <div className="address-card-phone">
                            Phone: {addr.phone}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="address-edit-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(addr)
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="add-new-btn"
                  onClick={() => {
                    resetForm()
                    setIsFormOpen(true)
                  }}
                >
                  ＋ Add New Address (Home, Work, etc.)
                </button>

                <div className="address-form-footer">
                  <button
                    className="address-save-button"
                    type="button"
                    onClick={proceedWithSelectedAddress}
                  >
                    Deliver to This Address <span>→</span>
                  </button>
                  <Link to="/checkout" className="address-cancel-button">
                    Cancel
                  </Link>
                </div>
              </>
            ) : (
              <form onSubmit={saveAddress}>
                {/* Address Type Tag Buttons */}
                <div className="address-field full-width">
                  <label className="address-label">Address Type</label>
                  <div className="type-selector">
                    {['Home', 'Work', 'Other'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`type-btn ${
                          form.addressType === type ? 'active' : ''
                        }`}
                        onClick={() =>
                          setform((prev) => ({ ...prev, addressType: type }))
                        }
                      >
                        {type === 'Home'
                          ? '🏠 Home'
                          : type === 'Work'
                          ? '🏢 Work'
                          : '📍 Other'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="address-fields">
                  {fields.map((field) => {
                    const fullWidth = [
                      'fullName',
                      'phone',
                      'addressLine',
                    ].includes(field.name)

                    return (
                      <div
                        key={field.name}
                        className={`address-field ${
                          fullWidth ? 'full-width' : ''
                        }`}
                      >
                        <label
                          className="address-label"
                          htmlFor={`address-${field.name}`}
                        >
                          {field.label}
                        </label>

                        <div className="address-input-wrap">
                          <span
                            className="address-input-icon"
                            aria-hidden="true"
                          >
                            {field.icon}
                          </span>

                          <input
                            id={`address-${field.name}`}
                            className="address-input"
                            name={field.name}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            maxLength={field.maxLength}
                            value={form[field.name]}
                            onChange={handleChange}
                            required
                            inputMode={
                              ['phone', 'pincode'].includes(field.name)
                                ? 'numeric'
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="address-form-footer">
                  <button
                    className="address-save-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving Address...'
                      : editingId
                      ? 'Update Address & Continue'
                      : 'Save Address & Continue'}
                    {!saving && <span>→</span>}
                  </button>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      className="address-cancel-button"
                      onClick={resetForm}
                    >
                      Back to Saved Addresses
                    </button>
                  )}
                </div>

                <p className="address-form-note">
                  <span>🔒</span>
                  Your address will be saved securely to your account.
                </p>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default CheckOutAddress