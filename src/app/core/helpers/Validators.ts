import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";


export function clearValidators(keys: string[], form: FormGroup) {
    keys.forEach(key => {
        const c = form.get(key);
        c?.clearValidators();
        c?.updateValueAndValidity({emitEvent: false, onlySelf: true})
    })
    form.updateValueAndValidity();
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
        const regex = /^\d+$/;
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
