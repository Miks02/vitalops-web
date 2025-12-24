import { AbstractControl, FormArray, FormControl, ValidatorFn } from "@angular/forms";


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
