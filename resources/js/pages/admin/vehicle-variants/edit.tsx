import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type VehicleBrand, type VehicleVariant } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

interface PageProps {
    vehicleVariant: VehicleVariant;
    vehicleBrands: Array<VehicleBrand>;
}

const variantSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    vehicleBrandId: z.coerce.number().min(1, 'Vehicle brand is required'),
});

type VariantFormValues = z.infer<typeof variantSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Vehicle Variant',
    },
];

export default function Edit() {
    const { vehicleVariant, vehicleBrands } = usePage().props as PageProps;
    const [errors, setErrors] = useState<{ name?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<VariantFormValues>({
        name: vehicleVariant.name,
        vehicleBrandId: vehicleVariant.vehicleBrandId,
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name ? serverErrors.name : undefined,
            vehicleBrandId: serverErrors.vehicleBrandId ? serverErrors.vehicleBrandId : undefined,
        });
    }, [serverErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = variantSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
                vehicleBrandId: flatErrors.vehicleBrandId?.[0],
            });
            return;
        }

        setErrors({});
        put(route('vehicle-variants.update', vehicleVariant.id));
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
                        <Select onValueChange={(e) => setData('vehicleBrandId', e)} value={String(data.vehicleBrandId ?? '')}>
                            <SelectTrigger className={`w-full ${errors.vehicleBrandId ? 'border-red-500' : ''}`}>
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
                        {errors.vehicleBrandId && <p className="text-sm text-red-500">{errors.vehicleBrandId}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
