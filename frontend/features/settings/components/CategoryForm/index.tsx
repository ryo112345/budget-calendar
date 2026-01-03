import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Category, CreateCategoryInput, UpdateCategoryInput, CategoryType } from "~/apis/model";

type Props = {
  category: Category | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCategoryInput | UpdateCategoryInput) => void;
};

const COLOR_OPTIONS = [
  { value: "#ef4444", label: "レッド" },
  { value: "#dc2626", label: "ダークレッド" },
  { value: "#f97316", label: "オレンジ" },
  { value: "#ea580c", label: "ダークオレンジ" },
  { value: "#eab308", label: "イエロー" },
  { value: "#ca8a04", label: "ダークイエロー" },
  { value: "#84cc16", label: "ライム" },
  { value: "#22c55e", label: "グリーン" },
  { value: "#16a34a", label: "ダークグリーン" },
  { value: "#14b8a6", label: "ティール" },
  { value: "#06b6d4", label: "シアン" },
  { value: "#0ea5e9", label: "スカイブルー" },
  { value: "#3b82f6", label: "ブルー" },
  { value: "#2563eb", label: "ダークブルー" },
  { value: "#6366f1", label: "インディゴ" },
  { value: "#8b5cf6", label: "パープル" },
  { value: "#a855f7", label: "バイオレット" },
  { value: "#ec4899", label: "ピンク" },
  { value: "#f43f5e", label: "ローズ" },
  { value: "#6b7280", label: "グレー" },
];

export function CategoryForm({ category, isOpen, isSaving, onClose, onSubmit }: Props) {
  const isEditing = !!category;
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("expense");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setType(category.type);
      setColor(category.color);
    } else {
      setName("");
      setType("expense");
      setColor(COLOR_OPTIONS[0].value);
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // 編集時はtypeを送信しない（サーバー側で更新不可のため）
    if (isEditing) {
      onSubmit({ name: name.trim(), color });
    } else {
      onSubmit({ name: name.trim(), type, color });
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg'>{category ? "カテゴリを編集" : "カテゴリを追加"}</h2>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded'>
            <X className='w-5 h-5' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          {/* Type selector - 編集時は変更不可 */}
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => !isEditing && setType("expense")}
              disabled={isEditing}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === "expense" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              支出
            </button>
            <button
              type='button'
              onClick={() => !isEditing && setType("income")}
              disabled={isEditing}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                type === "income" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              収入
            </button>
          </div>
          {isEditing && <p className='text-xs text-gray-500'>※カテゴリタイプは変更できません</p>}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>カテゴリ名</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='例: 食費'
              autoFocus
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>カラー</label>
            <div className='flex flex-wrap gap-2'>
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full border-2 transition ${color === option.value ? "border-gray-800 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                />
              ))}
            </div>
          </div>
          <div className='flex gap-2 pt-2'>
            <button type='button' onClick={onClose} className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition'>
              キャンセル
            </button>
            <button
              type='submit'
              disabled={isSaving || !name.trim()}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
            >
              {isSaving ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
