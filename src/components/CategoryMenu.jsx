import { Link } from 'react-router-dom';

function CategoryMenu({ categories = [] }) {
  return (
    <div className="category-menu">
      {categories.map((category) => (
        <Link key={category._id || category.name} to={`/category/${category._id || category.name}`}>
          {category.image ? <img src={category.image} alt="" /> : <span className="category-fallback" />}
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default CategoryMenu;
