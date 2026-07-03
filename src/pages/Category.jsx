import { useParams } from 'react-router-dom';
import Products from './Products.jsx';

function Category() {
  const { categoryId } = useParams();

  return <Products title="Category products" mode="category" categoryId={categoryId} />;
}

export default Category;
