import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, VehicleBrand, VehicleVariant } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

type PageProps = {
    vehicleVariant: VehicleVariant;
    vehicleBrands: Array<VehicleBrand>;
};

const variantSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    vehicle_brand_id: z.coerce.number().min(1, 'Vehicle brand is required'),
});

type VariantFormValues = z.infer<typeof variantSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Vehicle Variant',
        href: '/',
    },
];

export default function Edit() {
    const { vehicleVariant, vehicleBrands } = usePage<PageProps>().props;
    const [errors, setErrors] = useState<{ name?: string; vehicle_brand_id?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<VariantFormValues>({
        name: vehicleVariant.name,
        vehicle_brand_id: vehicleVariant.vehicle_brand_id,
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            vehicle_brand_id: serverErrors.vehicle_brand_id ? serverErrors.vehicle_brand_id : undefined,
        });
    }, [serverErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = variantSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
                vehicle_brand_id: flatErrors.vehicle_brand_id?.[0],
            });
            return;
        }

        setErrors({});
        put(route('admin.vehicle-variants.update', vehicleVariant.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Vehicle Variant" />
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
                        <Label htmlFor="vehicleBrand">Vehicle Brand</Label>
                        <Select onValueChange={(e) => setData('vehicle_brand_id', parseInt(e))} value={String(data.vehicle_brand_id ?? '')}>
                            <SelectTrigger className={`w-full ${errors.vehicle_brand_id ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select vehicle brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicleBrands.map((brand) => (
                                    <SelectItem key={brand.id} value={String(brand.id)}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.vehicle_brand_id && <p className="text-sm text-red-500">{errors.vehicle_brand_id}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
