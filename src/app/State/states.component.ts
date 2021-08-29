import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import {
  StateServiceProxy,
  StateListOutputDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../shared/app-component-base';
import { CreateStateDialogComponent } from './create-state-dialog.component';
import { EditStateDialogComponent } from './edit-state-dialog.component';


@Component({
  templateUrl: './states.component.html',
  animations: [appModuleAnimation()]
})
export class StatesComponent extends AppComponentBase implements OnInit {
    states: StateListOutputDto[] = [];

    constructor(
        injector: Injector,
        private _stateService: StateServiceProxy,
        private _modalService: BsModalService
    ) {
        super(injector);
    }
    ngOnInit() {

        this.getAllStates();
    }

    createState(): void {
        this.showCreateOrEditStateDialog();
    }

    editState(state): void {
        this.showCreateOrEditStateDialog(state.id);
    }

    async getAllStates() {
        this._stateService.getAll()
            .subscribe(result => {
                //debugger
                this.states = result;
            });
    }


    delete(state: any): void {
        abp.message.confirm(
            this.l('StateDeleteWarningMessage', state.name),
            undefined,
            (result: boolean) => {
                if (result) {
                    this._stateService.delete(state.id).subscribe(() => {
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                        this.getAllStates();
                    });
                }
            }
        );
    }

    private showCreateOrEditStateDialog(id?: number): void {
        let createOrEditStateDialog: BsModalRef;
        if (!id) {
            createOrEditStateDialog = this._modalService.show(
                CreateStateDialogComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditStateDialog = this._modalService.show(
                EditStateDialogComponent,
                {
                    class: 'modal-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditStateDialog.content.onSave.subscribe(() => {
            this.getAllStates();
        });
    }
}
