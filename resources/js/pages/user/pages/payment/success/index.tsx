import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import UserLayout from '../../../layouts/user-layout';

export default function Index() {
    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full flex-col items-center gap-5">
                <img src="/images/payment-approve.png" alt="Payment Approve" className="h-auto w-[30%] object-contain object-center" />

                <div className="w-full text-center text-2xl font-semibold text-black dark:text-white">Your Payments is Successfully</div>

                <div className="flex w-full justify-center">
                    <Link href="/">
                        <Button type="button" className="w-[300px]">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
