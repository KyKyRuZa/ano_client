import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import productApi from '../../api/product';
import '../../style/admin/admin.staff.css';

const ProductsPage = () => {
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentproduct, setCurrentproduct] = useState({
    id: null,
    title: '',
    description: '',
    media: null
  });
  const [isEditing, setIsEditing] = useState(false);

  // Состояния для подтверждения удаления
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setproductToDelete] = useState(null);

  useEffect(() => {
    fetchproducts();
  }, []);

  const fetchproducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productApi.getAll();
      setproducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Ошибка загрузки программ:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Ошибка загрузки программ';
      setError(errorMessage);
      setproducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setCurrentproduct((prev) => ({
          ...prev,
          media: file
        }));
      } else if (file) {
        setError('Можно загружать только изображения');
      }
    } else {
      setCurrentproduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setCurrentproduct({
      id: null,
      title: '',
      description: '',
      media: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentproduct({
      ...product,
      media: null
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Валидация: обязательные поля
  if (!currentproduct.title || !currentproduct.description) {
    setError('Название и описание продукта обязательны');
    return;
  }

  // Валидация: если есть файл, проверяем его тип
  if (currentproduct.media && !(currentproduct.media instanceof File)) {
    setError('Некорректный формат медиафайла');
    return;
  }

  if (currentproduct.media instanceof File && !currentproduct.media.type.startsWith('image/')) {
    setError('Можно загружать только изображения');
    return;
  }

  const formData = new FormData();
  formData.append('title', currentproduct.title);
  formData.append('description', currentproduct.description);

  if (currentproduct.media instanceof File) {
    formData.append('media', currentproduct.media);
  }

  try {
    if (isEditing) {
      await productApi.update(currentproduct.id, formData);
    } else {
      await productApi.create(formData);
    }

    fetchproducts();
    setIsModalOpen(false);
    setError(null); // Очистка ошибок
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    const errorMessage =
      err.response?.data?.error ||
      'Произошла ошибка при сохранении данных продукта';
    setError(errorMessage);
  }
};

  const handleDeleteClick = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setproductToDelete(product);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    const id = productToDelete.id;
    try {
      await productApi.delete(id);
      setproducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ошибка удаления продукта:', err);
      setError(err.message || 'Ошибка при удалении продукта');
    } finally {
      setShowDeleteConfirm(false);
      setproductToDelete(null);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Продукты организации</h1>
        <button className="btn btn-add" onClick={openAddModal}>
          <FontAwesomeIcon icon={faPlus} /> Добавить продукт
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>
                  {product.description
                    ? product.description.length > 50
                      ? `${product.description.substring(0, 50)}...`
                      : product.description
                    : '-'}
                </td>
                <td className='act'>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => openEditModal(product)}
                      title="Редактировать"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteClick(product.id)}
                      title="Удалить"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно для добавления/редактирования */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Редактировать программу' : 'Добавить программу'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={currentproduct.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание *</label>
                <textarea
                  name="description"
                  value={currentproduct.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Изображение</label>
                <input
                  type="file"
                  name="media"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                 <small> Разрешённые форматы: JPG, PNG. Максимальный размер: 10 МБ</small>
              </div>
                  {error && (
                    <div className="modal-error">
                      {error}
                    </div>
                  )}
              <div className="modal-actions">
                <button type="submit" className="btn btn-save"> Сохранить
                </button>
                <button type="button" className="btn btn-cancel"onClick={() => setIsModalOpen(false)} >
                   Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-delete-modal">
            <h2>Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить продукт <strong>{productToDelete?.title}</strong>?
            </p>
              {error && (
                    <div className="modal-error">
                      {error}
                    </div>
                  )}
            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Удалить
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;