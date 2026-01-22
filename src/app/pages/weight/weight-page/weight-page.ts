import { Component, computed, inject, AfterViewInit, signal } from '@angular/core';
import { WeightChart } from "../../misc/weight-chart/weight-chart";
import { LayoutState } from '../../../layout/services/layout-state';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  faSolidBullseye,
  faSolidClock,
  faSolidGhost,
  faSolidMagnifyingGlassChart,
  faSolidNoteSticky,
  faSolidScaleUnbalanced,
  faSolidWeightScale
} from "@ng-icons/font-awesome/solid";
import { Router } from '@angular/router';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { createWeightEntryForm, createTargetWeightForm } from '../../../core/helpers/Factories';
import { WeightEntryService } from '../services/weight-entry-service';
import { take } from 'rxjs';
import { NotificationService } from '../../../core/services/notification-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from "@angular/common";
import { UserService } from '../../../core/services/user-service';

@Component({
    selector: 'app-weight-page',
    imports: [WeightChart, NgIcon, ɵInternalFormsSharedModule, ReactiveFormsModule, ReactiveFormsModule, DatePipe],
    templateUrl: './weight-page.html',
    styleUrl: './weight-page.css',
    providers: [provideIcons({faSolidScaleUnbalanced, faSolidBullseye, faSolidMagnifyingGlassChart, faSolidClock, faSolidWeightScale, faSolidNoteSticky, faSolidGhost})]
})
export class WeightPage  {
    private layoutState = inject(LayoutState);
    private weightService = inject(WeightEntryService);
    private userService = inject(UserService);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    userSource = toSignal(this.userService.userDetails$, {initialValue: null});
    weightSummarySource = toSignal(this.weightService.weightSummary$, {initialValue: null});
    form = createWeightEntryForm(this.fb);
    targetWeightForm = createTargetWeightForm(this.fb);
    isTargetFormOpen = signal(false);
    isEditingTarget = computed(() => this.isTargetFormOpen())

    firstEntry = computed(() => this.weightSummarySource()?.firstEntry)
    currentWeight = computed(() => this.weightSummarySource()?.currentWeight)
    progress = computed(() => this.weightSummarySource()?.progress)
    targetWeight = computed(() => this.userSource()?.targetWeight)

    ngOnInit() {
        this.layoutState.setTitle("Weight Tracking");
        this.loadWeightSummary();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const elements = document.querySelectorAll('.typewriter');
            elements.forEach((el: any) => {
                el.style.setProperty('--target-width', el.scrollWidth + 'px');
            });
        }, 100);
    }

    loadWeightSummary() {
        return this.weightService.getMyWeightSummary()
            .pipe(take(1))
            .subscribe()
    }

    isControlInvalid(control: string) {
        const ct = this.form.get(control);

        if(ct?.invalid && (ct?.touched || ct?.dirty))
            return true;
        return false;
    }

    onSubmit() {
        if(this.form.invalid)
            return;

        this.weightService.addWeightEntry(this.form.value).pipe(take(1)).subscribe({
            next: () => {
                this.notificationService.showSuccess("Weight logged successfully");
                this.loadWeightSummary();
            }
        });

    }

    enableTargetWeightEdit() {
        if(this.isTargetFormOpen())
        {
            this.isTargetFormOpen.set(false);
            return;
        }

        this.isTargetFormOpen.set(true);
        const current = this.targetWeight();
        if(current) {
            this.targetWeightForm.patchValue({targetWeight: current});
        }
    }

    saveTargetWeight() {
        if(this.targetWeightForm.invalid)
            return;

        this.userService.updateTargetWeight(this.targetWeightForm.value).pipe(take(1)).subscribe({
            next: () => {
                this.notificationService.showSuccess("Target weight updated successfully");
                this.isTargetFormOpen.set(false);
            }
        });
    }

    cancelTargetWeightEdit() {
        this.isTargetFormOpen.set(false);
        this.targetWeightForm.reset();
    }

    isTargetWeightControlInvalid() {
        const ct = this.targetWeightForm.get('targetWeight');
        if(ct?.invalid && (ct?.touched || ct?.dirty))
            return true;
        return false;
    }

    getTargetWeightMessage() {
        if(this.targetWeight() === this.currentWeight()?.weight)
            return "You have reached your goal, well done!";
        return "Keep going you can do it!";
    }


}
