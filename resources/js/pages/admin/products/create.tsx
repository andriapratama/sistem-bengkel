import axios from 'axios';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, Unit } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

type PageProps = {
    units: Array<Unit>;
    categories: Array<Category>;
};

type VariantForm = {
    name: string;
    stock: number;
    cost: number;
    price: number;
};

const variantSchema = z.object({
    name: z.string().nullable().optional(),
    stock: z.coerce.number().nullable().optional(),
    cost: z.coerce.number().nullable().optional(),
    price: z.coerce.number().nullable().optional(),
});

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    stock: z.coerce.number().min(1, 'Stock must be ≥ 0'),
    cost: z.coerce.number().min(1, 'Cost must be ≥ 0'),
    price: z.coerce.number().min(1, 'Price must be ≥ 0'),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    status: z.boolean(),
    hasVariant: z.boolean(),
    category_id: z.coerce.number().min(1, 'Category is required'),
    unit_id: z.coerce.number().min(1, 'Unit is required'),
    variants: z.array(variantSchema).nullable().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Product',
        href: '/admin/products/add',
    },
];

export default function Create() {
    const { units, categories } = usePage<PageProps>().props;
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [variants, setVariants] = useState<VariantForm[]>([]);

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
        stock: 0,
        cost: 0,
        price: 0,
        image: null,
        status: false,
        hasVariant: false,
        category_id: 0,
        unit_id: 0,
        variants: [],
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            slug: serverErrors.slug ? serverErrors.slug : undefined,
            stock: serverErrors.stock ? serverErrors.stock : undefined,
            cost: serverErrors.cost ? serverErrors.cost : undefined,
            price: serverErrors.price ? serverErrors.price : undefined,
            category_id: serverErrors.category_id ? serverErrors.category_id : undefined,
            unit_id: serverErrors.unit_id ? serverErrors.unit_id : undefined,
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

    const onChangeNumber = (
        field:
            | 'name'
            | 'stock'
            | 'cost'
            | 'price'
            | 'slug'
            | 'description'
            | 'image'
            | 'status'
            | 'hasVariant'
            | 'category_id'
            | 'unit_id'
            | 'variants',
        value: string,
    ) => {
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

    const onAddVariant = () => {
        setVariants((prev) => [...prev, { name: '', stock: 0, cost: 0, price: 0 }]);
    };

    const onChangeVariant = (field: keyof VariantForm, value: string | number, index: number) => {
        setVariants((prev) =>
            prev.map((variant, i) => {
                if (i !== index) return variant;

                return {
                    ...variant,
                    [field]: field === 'name' ? String(value) : Number(value),
                };
            }),
        );

        setData('variants', variants);
    };

    const onRemoveVariant = (index: number) => {
        setVariants((prev) => prev.filter((item, i) => i !== index));
        setData('variants', variants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                category_id: flatErrors.category_id?.[0],
                unit_id: flatErrors.unit_id?.[0],
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
            } else if (key === 'variants') {
                formData.append('variants', JSON.stringify(variants));
            } else if (value !== null && value !== undefined && value !== '') {
                formData.append(key, String(value));
            }
        });

        try {
            const response = await axios.post('/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Product created:', response.data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />
            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                <div className="mx-auto flex w-[60%] flex-col gap-4 p-4">
                    <div className="flex w-full justify-end">
                        <Button type="submit" disabled={processing} className="w-fit">
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
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

                    <div className="grid w-full grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid w-full grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={(e) => setData('category_id', parseInt(e))} value={String(data.category_id ?? '')}>
                                <SelectTrigger className={`w-full ${errors.category_id ? 'border-red-500' : ''}`}>
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
                            {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="unit">Unit</Label>
                            <Select onValueChange={(e) => setData('unit_id', parseInt(e))} value={String(data.unit_id ?? '')}>
                                <SelectTrigger className={`w-full ${errors.unit_id ? 'border-red-500' : ''}`}>
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
                            {errors.unit_id && <p className="text-sm text-red-500">{errors.unit_id}</p>}
                        </div>
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

                    <div className="flex items-center gap-5">
                        <Label htmlFor="status">Status</Label>
                        <Switch checked={data.status} onCheckedChange={(e) => setData('status', e)} />
                    </div>

                    <div className="flex items-center gap-5">
                        <Label htmlFor="hasVariant">Variant</Label>
                        <Switch checked={data.hasVariant} onCheckedChange={(e) => setData('hasVariant', e)} />
                    </div>
                </div>

                {data.hasVariant ? (
                    <div className="mx-auto mb-10 flex w-[80%] flex-col gap-4 p-4">
                        <Label htmlFor="variants">Variants</Label>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[15%]">Stock</TableHead>
                                    <TableHead className="w-[20%]">Cost</TableHead>
                                    <TableHead className="w-[20%]">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map((variant, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Input
                                                id={`variant-name-${i}`}
                                                type="text"
                                                placeholder="ex: 1L - Matic "
                                                value={variant.name}
                                                onChange={(e) => onChangeVariant('name', e.target.value, i)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                id={`variant-stock-${i}`}
                                                type="text"
                                                value={variant.stock}
                                                onChange={(e) => onChangeVariant('stock', e.target.value, i)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                id={`variant-cost-${i}`}
                                                value={variant.cost}
                                                onChange={(e) => onChangeVariant('cost', e.target.value, i)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                id={`variant-price-${i}`}
                                                value={variant.price}
                                                onChange={(e) => onChangeVariant('price', e.target.value, i)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button type="button" size="icon" className="size-8" onClick={() => onRemoveVariant(i)}>
                                                <Trash />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex w-full justify-end">
                            <Button type="button" onClick={() => onAddVariant()}>
                                Add Variant
                            </Button>
                        </div>
                    </div>
                ) : null}
            </form>
        </AppLayout>
    );
}
