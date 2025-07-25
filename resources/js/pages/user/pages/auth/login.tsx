import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import UserLayout from '../../layouts/user-layout';

type LoginForm = {
    email: string;
    password: string;
};

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('/'), {
            onFinish: () => reset('password'),
        });
    };
    return (
        <UserLayout>
            <form className="mt-10 flex w-full items-center justify-between" onSubmit={submit}>
                <div className="h-auto w-[60%]">
                    <img src="/images/engine.jpg" alt="Enging" className="h-auto w-full object-contain object-center" />
                </div>

                <div className="flex w-[35%] flex-col">
                    <div className="text-[40px] text-white">Log In</div>
                    <p className="mb-10 text-base text-white">Enter your detail below</p>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            id="email"
                            type="email"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Email"
                            value={data.email}
                            required
                            disabled={processing}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="mb-10 flex w-full flex-col">
                        <input
                            id="password"
                            type="password"
                            className="w-full border-b border-solid border-neutral-600 px-1 py-1 text-white outline-none focus:border-white"
                            placeholder="Password"
                            value={data.password}
                            required
                            disabled={processing}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="mb-5 w-full">
                        <Button
                            type="submit"
                            className="flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-white font-semibold text-black"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </div>

                    <div className="flex w-full items-center justify-center gap-1 text-sm">
                        Dont have any account?
                        <TextLink href={route('register.create')} tabIndex={5}>
                            Register
                        </TextLink>
                    </div>
                </div>
            </form>
        </UserLayout>
    );
}
