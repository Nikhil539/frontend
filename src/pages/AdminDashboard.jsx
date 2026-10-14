import { useEffect, useMemo, useState } from "react";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
} from "../services/productService";

const emptyProduct = {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    rating: "",
};

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [query, setQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyProduct);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (loadError) {
            setError(loadError.message || "Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        getAllProducts()
            .then((data) => {
                if (isMounted) setProducts(data);
            })
            .catch((loadError) => {
                if (isMounted) {
                    setError(loadError.message || "Unable to load products.");
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return products;

        return products.filter((product) =>
            [product.name, product.category, product.description]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedQuery)),
        );
    }, [products, query]);

    const inventoryUnits = products.reduce(
        (total, product) => total + Number(product.stock || 0),
        0,
    );
    const lowStockCount = products.filter(
        (product) => Number(product.stock) <= 5,
    ).length;

    const openCreateForm = () => {
        setEditingProduct(null);
        setForm(emptyProduct);
        setError("");
        setIsFormOpen(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "",
            stock: product.stock ?? "",
            imageUrl: product.imageUrl || "",
            rating: product.rating ?? "",
        });
        setError("");
        setIsFormOpen(true);
    };

    const closeForm = () => {
        if (isSaving) return;
        setIsFormOpen(false);
        setEditingProduct(null);
        setForm(emptyProduct);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setError("");
        setNotice("");

        const productData = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            rating: Number(form.rating || 0),
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                setNotice("Product updated successfully.");
            } else {
                await createProduct(productData);
                setNotice("Product added successfully.");
            }

            setIsFormOpen(false);
            setEditingProduct(null);
            setForm(emptyProduct);
            await loadProducts();
        } catch (saveError) {
            setError(saveError.message || "Unable to save this product.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            return;
        }

        setDeletingId(product.id);
        setError("");
        setNotice("");
        try {
            await deleteProduct(product.id);
            setProducts((currentProducts) =>
                currentProducts.filter((item) => item.id !== product.id),
            );
            setNotice(`${product.name} was deleted.`);
        } catch (deleteError) {
            setError(deleteError.message || "Unable to delete this product.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="admin-dashboard">
            <div className="admin-heading">
                <div>
                    <p className="admin-eyebrow">STORE MANAGEMENT</p>
                    <h1>Dashboard</h1>
                    <p className="admin-subtitle">
                        Keep your catalog organized and your inventory on track.
                    </p>
                </div>
                <button className="admin-primary-button" onClick={openCreateForm}>
                    <span aria-hidden="true">+</span> Add product
                </button>
            </div>

            <div className="admin-stats">
                <article className="admin-stat-card">
                    <span className="admin-stat-icon">▦</span>
                    <div>
                        <p>Products</p>
                        <strong>{products.length}</strong>
                    </div>
                    <span className="admin-stat-note">in catalog</span>
                </article>
                <article className="admin-stat-card">
                    <span className="admin-stat-icon admin-stat-icon-green">↗</span>
                    <div>
                        <p>Inventory units</p>
                        <strong>{inventoryUnits}</strong>
                    </div>
                    <span className="admin-stat-note">available</span>
                </article>
                <article className="admin-stat-card">
                    <span className="admin-stat-icon admin-stat-icon-amber">!</span>
                    <div>
                        <p>Low stock</p>
                        <strong>{lowStockCount}</strong>
                    </div>
                    <span className="admin-stat-note">5 units or less</span>
                </article>
            </div>

            {notice && <p className="admin-notice" role="status">{notice}</p>}
            {error && !isFormOpen && (
                <div className="admin-alert" role="alert">
                    <span>{error}</span>
                    <button onClick={loadProducts}>Try again</button>
                </div>
            )}

            <section className="admin-products-panel">
                <div className="admin-panel-heading">
                    <div>
                        <h2>Product catalog</h2>
                        <p>Manage your store's products and stock levels.</p>
                    </div>
                    <label className="admin-search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search products"
                            aria-label="Search products"
                        />
                    </label>
                </div>

                {loading ? (
                    <p className="admin-empty-state">Loading your catalog...</p>
                ) : products.length === 0 ? (
                    <div className="admin-empty-state">
                        <span className="admin-empty-icon">▦</span>
                        <h3>Your catalog is ready for its first product</h3>
                        <p>Add a product to start building your store.</p>
                        <button className="admin-primary-button" onClick={openCreateForm}>
                            Add your first product
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <p className="admin-empty-state">No products match “{query}”.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-product-table">
                            <thead>
                                <tr>
                                    <th scope="col">Product</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="admin-product-cell">
                                                <img
                                                    src={product.imageUrl || "/icons.svg"}
                                                    alt=""
                                                    loading="lazy"
                                                />
                                                <div>
                                                    <strong>{product.name}</strong>
                                                    <span>{product.description || "No description"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category || "—"}</td>
                                        <td className="admin-price">₹{Number(product.price).toLocaleString("en-IN")}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={`stock-badge ${Number(product.stock) <= 5 ? "stock-badge-low" : "stock-badge-ok"}`}>
                                                {Number(product.stock) <= 5 ? "Low stock" : "In stock"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-row-actions">
                                                <button
                                                    className="admin-action-button"
                                                    onClick={() => openEditForm(product)}
                                                    aria-label={`Edit ${product.name}`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="admin-action-button admin-delete-button"
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deletingId === product.id}
                                                    aria-label={`Delete ${product.name}`}
                                                >
                                                    {deletingId === product.id ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {isFormOpen && (
                <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closeForm();
                }}>
                    <section
                        className="admin-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="product-form-title"
                    >
                        <div className="admin-modal-heading">
                            <div>
                                <p className="admin-eyebrow">CATALOG</p>
                                <h2 id="product-form-title">
                                    {editingProduct ? "Edit product" : "Add a product"}
                                </h2>
                            </div>
                            <button className="admin-modal-close" onClick={closeForm} aria-label="Close dialog">×</button>
                        </div>

                        {error && <p className="admin-alert admin-form-alert" role="alert">{error}</p>}
                        <form className="admin-product-form" onSubmit={handleSubmit}>
                            <label>
                                Product name
                                <input
                                    value={form.name}
                                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Category
                                <input
                                    value={form.category}
                                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                                    required
                                />
                            </label>
                            <label className="admin-form-wide">
                                Description
                                <textarea
                                    value={form.description}
                                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                                    rows="3"
                                />
                            </label>
                            <label>
                                Price (₹)
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Stock
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={(event) => setForm({ ...form, stock: event.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Rating
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={(event) => setForm({ ...form, rating: event.target.value })}
                                />
                            </label>
                            <label>
                                Image URL
                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                                    placeholder="https://..."
                                />
                            </label>
                            <div className="admin-form-actions admin-form-wide">
                                <button type="button" className="admin-secondary-button" onClick={closeForm} disabled={isSaving}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-primary-button" disabled={isSaving}>
                                    {isSaving ? "Saving..." : editingProduct ? "Save changes" : "Add product"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </section>
    );
}

export default AdminDashboard;
