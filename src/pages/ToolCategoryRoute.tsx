import { Navigate, useParams } from 'react-router-dom';

import { CategoryToolPage } from '../components/CategoryToolPage';
import { getToolCategory } from '../data/toolCategories';

export function ToolCategoryRoute() {
  const { categorySlug } = useParams();
  const category = getToolCategory(categorySlug);

  if (!category) {
    return <Navigate to="/tools/developer" replace />;
  }

  return <CategoryToolPage category={category} />;
}