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
  CreateCountryInputDto,
  RoleDto
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  templateUrl: './edit-country-dialog.component.html'
})
export class EditCountryDialogComponent extends AppComponentBase
  implements OnInit {
    saving = false;
    id: number;

  country = new CreateCountryInputDto();
  
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

    ngOnInit() {
        this.getCountryById();
      }

   async getCountryById() {
        this._countryService.getById(this.id).subscribe(result => {
            this.country = result;
            }    
        );
    }

   save(): void {
    this.saving = true;

    
    this._countryService.update(this.country).subscribe(
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
