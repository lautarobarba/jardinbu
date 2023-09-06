import { AlertCircleIcon, AlertTriangle, CheckCircleIcon, InfoIcon } from "lucide-react";
import { ReactNode } from "react";

interface AlertProps {
    severity: 'error' | 'info' | 'success' | 'warning';
    children: ReactNode | string;
}

export const Alert = (props: AlertProps) => {
    const { severity, children } = props;
    return (
        <div
            role="alert"
            className={`
                p-4 mb-4 text-sm rounded-lg flex flex-row items-center
                ${severity === 'info' ? 'text-blue-800 bg-blue-100' : ''}
                ${severity === 'success' ? 'text-green-800 bg-green-100' : ''}
                ${severity === 'warning' ? 'text-yellow-800 bg-yellow-100' : ''}
                ${severity === 'error' ? 'text-red-800 bg-red-100' : ''}
            `}
        >
            <div>
                {severity === 'info' && <InfoIcon className="mr-2" />}
                {severity === 'success' && <CheckCircleIcon className="mr-2" />}
                {severity === 'warning' && <AlertTriangle className="mr-2" />}
                {severity === 'error' && <AlertCircleIcon className="mr-2" />}
            </div>
            <div>{children}</div>
        </div>
    );
}