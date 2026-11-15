import "./CategorySection.css";

const categories = ["Fashion", "Accessories", "Tech", "Essentials"];

function CategorySection({ onSelectCategory = () => {} }) {
  return (
    <section className="categories" aria-labelledby="categories-title">
      <h2 id="categories-title">Categories</h2>

      <div className="category-list">
        {categories.map((category) => (
          <a
            href="#shop"
            key={category}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </a>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;