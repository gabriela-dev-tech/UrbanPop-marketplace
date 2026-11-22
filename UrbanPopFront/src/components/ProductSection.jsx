import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import { apiRequest } from "../services/api";
import "./ProductSection.css";

function ProductSection({ selectedCategory = "All" }) {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest("/api/products/");

        setProducts(
          data.map((product) => ({
            ...product,
            price: Number(product.price),
          }))
        );
      } catch (loadError) {
        setError(
          loadError.message === "Failed to fetch"
            ? "Could not load products. Make sure Django is running."
            : loadError.message || "Could not load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const visibleProducts =
    selectedCategory === "All"
      ? products.filter((product) => product.is_featured)
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="products" aria-labelledby="products-title">
      <h2 id="products-title">
        {selectedCategory === "All" ? "Featured Products" : selectedCategory}
      </h2>

      {loading && <p>Loading products…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <p>No products in this category yet.</p>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              {product.image && (
                <img src={product.image} alt={product.name} />
              )}

              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>

              <button
                className="add-to-cart"
                type="button"
                onClick={() => addItem(product)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductSection;