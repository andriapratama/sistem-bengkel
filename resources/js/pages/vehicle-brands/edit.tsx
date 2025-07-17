import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type VehicleBrand } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

interface Props {
    vehicleBrand: VehicleBrand;
}

const brandSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type BrandFormValues = z.infer<typeof brandSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Vehicle Brand',
    },
];

export default function Edit({ vehicleBrand }: Props) {
    const [errors, setErrors] = useState<{ name?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<BrandFormValues>({
        name: vehicleBrand.name,
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
        });
    }, [serverErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = brandSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
            });
            return;
        }

        setErrors({});
        put(route('vehicle-brands.update', vehicleBrand.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Vehicle Brand" />
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

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
