import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

interface PageProps {
    product: Product;
}

const productSchema = z.object({
    image: z.instanceof(File, { message: 'Image must be a file' }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Image Product',
    },
];

export default function EditImage() {
    const { product } = usePage().props as PageProps;
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
    const [preview, setPreview] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
    } = useForm<ProductFormValues>({
        image: undefined,
    });

    useEffect(() => {
        setPreview(product.image_url);
    }, [product]);

    useEffect(() => {
        setErrors({
            image: serverErrors.image ? serverErrors.image : undefined,
        });
    }, [serverErrors]);

    const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));

            if (errors.image) {
                setErrors((prev) => ({ ...prev, image: undefined }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = productSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                image: flatErrors.image?.[0],
            });
            return;
        }

        setErrors({});
        const formData = new FormData();
        formData.append('image', data.image);
        formData.append('_method', 'PUT');

        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        post(`/products/${product.id}/image`, {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            <div className="mx-auto w-[50%]">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={onChangeImage} className={errors.image ? 'border-red-500' : ''} />
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

                        {preview && (
                            <div className="mx-auto mt-2 flex aspect-square w-[200px] items-center justify-center overflow-hidden">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
