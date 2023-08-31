"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/providers/AuthProvider";
import { LogoutRequiredPageWrapper } from "@/wrappers/LogoutRequiredPageWrapper";
import { LoginUserDto } from "@/interfaces/auth.interface";
import * as Yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import { PageTitle } from "@/components/PageTitle";
import { PageSubTitle } from "@/components/PageSubTitle";
import { Button, Input } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { LoadingPageWrapper } from "@/wrappers/LoadingPageWrapper";


const ValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('El email no es válido')
        .required('Por favor, ingrese una cuenta de correo'),
    password: Yup.string()
        .min(2, 'Contraseña Demasiado corta')
        .max(50, 'Contraseña Demasiado larga')
        .required('Por favor, ingrese la contraseña'),
});

interface Values {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { login, status } = useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const loginUserDto: LoginUserDto = {
                email: values.email,
                password: values.password,
            };
            login(loginUserDto, setErrors);
        },
    });

    return (
        <LogoutRequiredPageWrapper>
            <section
                id='authentication-layout'
                className="w-screen md:w-full flex flex-col justify-center items-center"
            >
                <PageTitle title="Biblioteca del bosque" className="mt-5 md:my-1" />
                <PageSubTitle title="Iniciar sesión" className="text-center" />

                <form onSubmit={formik.handleSubmit} className="w-full px-5 xl:px-20 space-y-2">
                    <Input
                        // Value
                        type="text"
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.email && Boolean(formik.errors.email)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.email && formik.errors.email}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    />
                    <Input
                        // Value
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        label="Contraseña"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.password && Boolean(formik.errors.password)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.password && formik.errors.password}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        // Password toggle
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? (
                                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Button
                        type="submit"
                        color="primary"
                        radius="sm"
                        className="w-full uppercase"
                    >
                        Iniciar sesión
                    </Button>
                    <div>
                        <Link
                            href="#"
                            className='text-dark dark:text-light hover:text-blue-700 dark:hover:text-blue-400'
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div>
                        <Link
                            href="/auth/register"
                            className='text-dark dark:text-light hover:text-blue-700 dark:hover:text-blue-400'
                        >
                            ¿Todavía no tenés cuenta? Registrate
                        </Link>
                    </div>
                </form>
            </section>
        </LogoutRequiredPageWrapper>
    );
};

export default LoginPage;
