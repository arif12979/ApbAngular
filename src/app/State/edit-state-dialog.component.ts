import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CountryServiceProxy,
    CountryListOutputDto,
    StateServiceProxy,
  CreateStateInputDto
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  templateUrl: './edit-state-dialog.component.html'
})
export class EditStateDialogComponent extends AppComponentBase
  implements OnInit {
    saving = false;
    id: number;

    state = new CreateStateInputDto();
    countries: CountryListOutputDto[] = [];
  
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public _stateService: StateServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

    ngOnInit() {
        this.getAllCountries();
        this.getStateById();
      }

   async getStateById() {
        this._stateService.getById(this.id).subscribe(result => {
            this.state = result;
            }    
        );
    }
    async getAllCountries() {
        this._countryService.getAll()
            .subscribe(result => {
                this.countries = result;
            });
    }
   save(): void {
    this.saving = true;

    
    this._stateService.update(this.state).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}
