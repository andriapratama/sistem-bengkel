import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Category',
        href: '/categories/add',
    },
];

export default function Create() {
    const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
    } = useForm<CategoryFormValues>({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            slug: serverErrors.slug ? serverErrors.slug : undefined,
        });
    }, [serverErrors]);

    const onChangeName = (value: string) => {
        setData('name', value);
        const slug = value
            .toLocaleLowerCase()
            .replaceAll(/[^a-z0-9-\s]/g, '')
            .replaceAll(/\s/g, '-');
        setData('slug', slug);
    };

    const onChangeSlug = (value: string) => {
        const slug = value
            .toLocaleLowerCase()
            .replaceAll(/[^a-z0-9-\s]/g, '')
            .replaceAll(/\s/g, '-');
        setData('slug', slug);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = categorySchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
                slug: flatErrors.slug?.[0],
            });
            return;
        }

        setErrors({});
        post(route('categories.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Category" />
            <div className="mx-auto w-[50%]">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => {
                                onChangeName(e.target.value);

                                if (errors.name) {
                                    setErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => {
                                onChangeSlug(e.target.value);

                                if (errors.slug) {
                                    setErrors((prev) => ({ ...prev, slug: undefined }));
                                }
                            }}
                            className={errors.slug ? 'border-red-500' : ''}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                    </div>

                    <div>
                        <Label htmlFor="slug">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => {
                                setData('description', e.target.value);
                            }}
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
