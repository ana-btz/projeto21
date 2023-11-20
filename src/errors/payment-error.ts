import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
    return {
        name: 'PaymentRequiredError',
        message: 'You must make payment to proceed',
    };
}