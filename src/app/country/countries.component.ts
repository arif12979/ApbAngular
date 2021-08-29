
import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  CountryServiceProxy,
  CountryListOutputDto,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../shared/app-component-base';
import { CreateCountryDialogComponent } from './create-country-dialog.component';
import { EditCountryDialogComponent } from './edit-country-dialog.component';



@Component({
  templateUrl: './countries.component.html',
  animations: [appModuleAnimation()]
})
export class CountriesComponent extends AppComponentBase implements OnInit {
    countries: CountryListOutputDto[] = [];
  
  constructor(
    injector: Injector,
    private _countryService: CountryServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
    ngOnInit() {

        this.getAllCountries();
    }
   
  createCountry():void {
    this.showCreateOrEditCountryDialog();
  }

  editCountry(country): void {
    this.showCreateOrEditCountryDialog(country.id);
  }

    async getAllCountries() {
        this._countryService.getAll()
            .subscribe(result => {
                debugger
                this.countries = result;
            });
    }
  

   delete(country:any): void {
    abp.message.confirm(
      this.l('CountryDeleteWarningMessage', country.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._countryService.delete(country.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.getAllCountries();
          });
        }
      }
    );
  }

    private showCreateOrEditCountryDialog(id?: number): void {
        let createOrEditCountryDialog: BsModalRef;
        if (!id) {
            createOrEditCountryDialog = this._modalService.show(
                CreateCountryDialogComponent,
                {
                    class: 'modal-lg',
                }
            );
        } else {
            createOrEditCountryDialog = this._modalService.show(
                EditCountryDialogComponent,
                {
                    class: 'modal-lg',
                    initialState: {
                        id: id,
                    },
                }
            );
        }

        createOrEditCountryDialog.content.onSave.subscribe(() => {
            this.getAllCountries();
        });
    }
  
}
