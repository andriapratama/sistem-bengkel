import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type Unit } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

interface PageProps {
    units: Array<Unit>;
    categories: Array<Category>;
}

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    stock: z.coerce.number().min(1, 'Stock must be ≥ 0'),
    cost: z.coerce.number().min(1, 'Cost must be ≥ 0'),
    price: z.coerce.number().min(1, 'Price must be ≥ 0'),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    status: z.boolean(),
    categoryId: z.coerce.number().min(1, 'Category is required'),
    unitId: z.coerce.number().min(1, 'Unit is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Product',
        href: '/products/add',
    },
];

export default function Create() {
    const { units, categories } = usePage().props as PageProps;
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
    const [preview, setPreview] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
    } = useForm<ProductFormValues>({
        name: '',
        slug: '',
        description: '',
        stock: '',
        cost: '',
        price: '',
        image: null as FileList | null,
        status: false,
        categoryId: '',
        unitId: '',
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            slug: serverErrors.slug ? serverErrors.slug : undefined,
            stock: serverErrors.stock ? serverErrors.stock : undefined,
            cost: serverErrors.cost ? serverErrors.cost : undefined,
            price: serverErrors.price ? serverErrors.price : undefined,
            categoryId: serverErrors.categoryId ? serverErrors.categoryId : undefined,
            unitId: serverErrors.unitId ? serverErrors.unitId : undefined,
        });
    }, [serverErrors]);

    const onChangeString = (field: keyof ProductFormValues, value: string) => {
        if (field === 'name') {
            setData('name', value);
        }

        const slug = value
            .toLocaleLowerCase()
            .replaceAll(/[^a-z0-9-\s]/g, '')
            .replaceAll(/\s/g, '-');
        setData('slug', slug);

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const onChangeNumber = (field: string, value: string) => {
        const number = value.replaceAll(/[^0-9]/g, '');
        setData(field, number);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

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
                name: flatErrors.name?.[0],
                slug: flatErrors.slug?.[0],
                stock: flatErrors.stock?.[0],
                cost: flatErrors.cost?.[0],
                price: flatErrors.price?.[0],
                categoryId: flatErrors.categoryId?.[0],
                unitId: flatErrors.unitId?.[0],
            });
            return;
        }

        setErrors({});
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'image' && value instanceof FileList && value.length > 0) {
                formData.append(key, value[0]);
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined && value !== '') {
                formData.append(key, String(value));
            }
        });

        post('/products', {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />
            <div className="mx-auto w-[50%]">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => onChangeString('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => onChangeString('slug', e.target.value)}
                            className={errors.slug ? 'border-red-500' : ''}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                    </div>

                    <div>
                        <Label htmlFor="slug">Description</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            value={data.stock ?? ''}
                            onChange={(e) => onChangeNumber('stock', e.target.value)}
                            className={errors.stock ? 'border-red-500' : ''}
                        />
                        {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                    </div>

                    <div>
                        <Label htmlFor="cost">Cost</Label>
                        <Input
                            id="cost"
                            value={data.cost ?? ''}
                            onChange={(e) => onChangeNumber('cost', e.target.value)}
                            className={errors.cost ? 'border-red-500' : ''}
                        />
                        {errors.cost && <p className="text-sm text-red-500">{errors.cost}</p>}
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            value={data.price ?? ''}
                            onChange={(e) => onChangeNumber('price', e.target.value)}
                            className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(e) => setData('categoryId', e)} value={String(data.categoryId ?? '')}>
                            <SelectTrigger className={`w-full ${errors.categoryId ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                    </div>

                    <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select onValueChange={(e) => setData('unitId', e)} value={String(data.unitId ?? '')}>
                            <SelectTrigger className={`w-full ${errors.unitId ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={String(unit.id)}>
                                        {unit.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.unitId && <p className="text-sm text-red-500">{errors.unitId}</p>}
                    </div>

                    <div className="flex items-center gap-5">
                        <Label htmlFor="status">Status</Label>
                        <Switch checked={data.status} onCheckedChange={(e) => setData('status', e)} />
                    </div>

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
