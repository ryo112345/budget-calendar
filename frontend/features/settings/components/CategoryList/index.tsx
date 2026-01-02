import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "~/apis/model";

type Props = {
  categories: Category[];
  isDeleting: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
};

export function CategoryList({ categories, isDeleting, onEdit, onDelete }: Props) {
  if (categories.length === 0) {
    return (
      <div className='py-12 text-center text-gray-500'>
        <p>カテゴリがありません</p>
        <p className='text-sm mt-1'>「追加」ボタンからカテゴリを作成してください</p>
      </div>
    );
  }

  return (
    <div className='divide-y divide-gray-200'>
      {categories.map((category) => (
        <div key={category.id} className='flex items-center gap-3 py-3 px-4'>
          <div className='w-4 h-4 rounded-full shrink-0' style={{ backgroundColor: category.color }} />
          <span className='text-gray-800'>{category.name}</span>
          <div className='flex items-center gap-1 ml-auto'>
            <button
              onClick={() => onEdit(category)}
              className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition'
              title='編集'
            >
              <Pencil className='w-4 h-4' />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              disabled={isDeleting}
              className='p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition disabled:opacity-50'
              title='削除'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
