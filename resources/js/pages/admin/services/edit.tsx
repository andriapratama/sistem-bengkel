import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    service: Service;
}

const serviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    estimated_duration: z.coerce.number().optional(),
    estimated_price: z.coerce.number().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Service',
        href: '/services/edit',
    },
];

export default function Edit({ service }: Props) {
    const [errors, setErrors] = useState<{ name?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<ServiceFormValues>({
        name: service.name,
        description: service.description,
        estimated_duration: service.estimated_duration,
        estimated_price: parseFloat(service.estimated_price),
    });

    const onChangeNumber = (field: 'estimated_duration' | 'estimated_price', value: string) => {
        const number = value.replaceAll(/[^0-9]/g, '');
        setData(field, parseFloat(number || '0'));
    };

    useEffect(() => {
        setErrors({
            name: serverErrors.name ?? undefined,
        });
    }, [serverErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = serviceSchema.safeParse(data);

        if (!result.success) {
            const errors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as string;
                if (!errors[key]) {
                    errors[key] = issue.message;
                }
            });

            setErrors({
                name: errors['name'],
            });
            return;
        }

        setErrors({});
        put(route('admin.services.update', service.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Service" />
            <div className="mx-auto w-[50%]">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);

                                if (errors.name) {
                                    setErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            disabled={processing}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            disabled={processing}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="estimated_duration">Estimated Duration (Minute)</Label>
                        <Input
                            id="estimated_duration"
                            disabled={processing}
                            value={data.estimated_duration ?? 0}
                            onChange={(e) => onChangeNumber('estimated_duration', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="estimated_price">Estimated Price</Label>
                        <Input
                            id="estimated_price"
                            disabled={processing}
                            value={data.estimated_price ?? 0}
                            onChange={(e) => onChangeNumber('estimated_price', e.target.value)}
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
