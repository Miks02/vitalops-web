import { HttpErrorResponse } from "@angular/common/http";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { ValidationError } from "../models/ValidationError";

export function isControlValid(control: string, form: FormGroup): boolean {
    const ct = form?.get(control);
    if(!ct)
        return false;
    return !(ct.invalid && (ct.touched || ct.dirty))
}

export function addValidators(keys: string[], form: FormGroup, validators: ValidatorFn | ValidatorFn[]) {
    const validatorArray = Array.isArray(validators)
    ? validators
    : [validators]

    keys.forEach(key => {
        const c = form.get(key)
        if(!c)
            return;

        const existing: ValidatorFn[] = c?.validator
        ? [c.validator]
        : []
        c.setValidators([...existing, ...validatorArray])
        c.updateValueAndValidity({emitEvent: false});

    })
    form.updateValueAndValidity({emitEvent: false});

}

export function clearValidators(keys: string[], form: FormGroup) {
    keys.forEach(key => {
        const c = form.get(key);
        c?.clearValidators();
        c?.updateValueAndValidity({emitEvent: false, onlySelf: true})
    })
    form.updateValueAndValidity();
}

export function clearFormInputs(keys: string[], form: FormGroup) {
    keys.forEach(key => {
        const c = form.get(key);

        c?.reset();
        c?.updateValueAndValidity({emitEvent: false, onlySelf: true})

    })
    form.updateValueAndValidity();

}

export function handleValidationErrors(err: HttpErrorResponse, form: FormGroup) {
    if(err.status === 400 && err.error.errors) {
        const error: ValidationError = err.error;

        Object.keys(error.errors).forEach(prop => {
            const firstPropLetter = prop.charAt(0);

            const transformedProp: string = prop.replace(firstPropLetter, firstPropLetter.toLowerCase())
            const formControl = form.get(transformedProp);
            if(formControl) {
                formControl.setErrors({validationError: error.errors[prop][0]})
                form.updateValueAndValidity();
            }
        })
    }
    return;
}

export function minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl) => {
        const array = control as FormArray
        return array.length >= min
        ? null
        : {
            minArrayLength: {
                required: min,
                actual: array.length
            }
        }
    }
}

export function onlyNumbersCheck(): ValidatorFn {
    return (control: AbstractControl) => {
        const regex = /^\d+([.,]\d+)?$/;
        const input = control as FormControl
        if(regex.test(control.value))
            return null;
        return {
            onlyNumbersCheck: {
                input: input
            }
        }
    }
}
