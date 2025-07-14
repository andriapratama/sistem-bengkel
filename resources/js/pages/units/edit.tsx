import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

interface Unit {
    id: number;
    name: string;
    code: string;
}

interface Props {
    unit: Unit;
}

const unitSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
});

type UnitFormValues = z.infer<typeof unitSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Unit',
        href: '/units',
    },
];

export default function Edit({ unit }: Props) {
    const [errors, setErrors] = useState<{ name?: string; code?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<UnitFormValues>({
        name: unit.name,
        code: unit.code,
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            code: serverErrors.code ? serverErrors.code : undefined,
        });
    }, [serverErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = unitSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
                code: flatErrors.code?.[0],
            });
            return;
        }

        setErrors({});
        put(route('units.update', unit.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Unit" />
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
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => {
                                setData('code', e.target.value);

                                if (errors.code) {
                                    setErrors((prev) => ({ ...prev, code: undefined }));
                                }
                            }}
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
