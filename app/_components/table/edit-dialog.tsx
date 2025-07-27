'use client';

import { AutoFormGenerator, type FormConfig } from '@/app/_components/auto-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface EditDialogProps<T extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  data: T | null;
  formConfig: FormConfig<T>;
  onSave: (data: T) => Promise<void>;
  title?: string;
  description?: string;
}

export function EditDialog<T extends Record<string, any>>({
  isOpen,
  onClose,
  data,
  formConfig,
  onSave,
  title = 'データを編集',
  description = '以下のフォームでデータを編集してください。',
}: EditDialogProps<T>) {
  const handleSave = async (formData: T) => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // エラーハンドリングは呼び出し元で行う
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {data && (
          <div className="mt-4">
            <AutoFormGenerator
              config={{
                ...formConfig,
                title: '', // ダイアログ内では不要
                description: undefined,
              }}
              onSubmit={handleSave}
              defaultValues={data}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
