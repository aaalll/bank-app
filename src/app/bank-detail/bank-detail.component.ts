import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IBankDetail } from "../ibank";
import { ICountry } from "../icountry"
import { ICardSchemes } from "../icardschemes"
import { BankService } from "../bank.service";
import { MediaService } from "../media.service";
import { DataService } from "../data.service"

export const MY_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BankDetailComponent implements OnInit {
  bankForm: FormGroup;
  newBank: boolean;
  banCode: string;
  selectedCountryCtrl = new FormControl();
  bank: IBankDetail;
  tabIndex: number = 0;
  preferredMethod: string
  countries: ICountry[];
  cardSchemes: ICardSchemes[];
  isDesktop: boolean;
  private mediaService = new MediaService('(min-width: 768px)')

  constructor(
    private bankService: BankService,
    private dataService: DataService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.newBank = !this.activatedRoute.snapshot.params['id'] || !(this.activatedRoute.snapshot.params['id'].length > 0)
    this.mediaService.match$.subscribe(value => this.isDesktop = value);
    forkJoin(
      [this.dataService.getCounties(),
      this.dataService.getCardScheme()]

    ).subscribe((responseList: any) => {
      this.countries = responseList[0].countries;
      this.cardSchemes = responseList[1].cardSchemes;
    });

    if (!this.newBank) {
      this.banCode = this.activatedRoute.snapshot.params['id']
      this.bankService.getBank(this.banCode).subscribe((bank: IBankDetail) => {
        this.bank = bank;
        const editBank = {
          bankCode: bank.bankCode,
          bankName: bank.bankName,
          bankURL: bank.bankUrl || '',
          country: ("000" + bank.country).substr(-3),
          cardSchemes: bank.cardSchemes.map((item: ICardSchemes) => item.id) || [],
          contactName: bank.contact.name,
          contactEmail: bank.contact.email,
          contactNumber: bank.contact.mobile || '',
          contactPreferredMethod: "" + bank.contact.preferredMethod,
          billingStartDate: moment(bank.billing.startDate, 'YYYY-MM-DD'),
          billingPeriod: "" + bank.billing.period,
          billingEmail: bank.billing.email,
          billingSameEmail: bank.contact.email == bank.billing.email
        }
        this.bankForm.setValue(editBank)
        this.preferredMethod = "" + bank.contact.preferredMethod
      }, (error: any) => {
        console.error('getBank', error);
        alert('not exist')
        this.router.navigate(['/banks']);
      })
    } else {

    }
    this.createBankForm();
  }
  back = function () {
    if (this.tabIndex > 0) {
      this.tabIndex--;
    }
  };
  next = function () {
    if (this.tabIndex < 2) {
      this.tabIndex++;
    }
  }
  onTabChanged($event) {
    this.tabIndex = $event.index;
  }

  createBankForm() {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const phoneRegex = /^(\+?)\d{1,19}(?!.)/;
    const preferredRegex = /1|2/;

    this.bankForm = this.fb.group({
      bankCode: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      bankName: ["", [Validators.required, Validators.maxLength(50)]],
      bankURL: ["", [Validators.required, Validators.maxLength(255), Validators.pattern(urlRegex)]],
      country: ["", [Validators.required]],
      cardSchemes: ["", [Validators.required]],
      contactName: ["", [Validators.required, Validators.maxLength(50)]],
      contactEmail: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
      contactNumber: ["", [Validators.pattern(phoneRegex)]],
      contactPreferredMethod: ["1", [Validators.required, Validators.pattern(preferredRegex)]],
      billingStartDate: ["", [Validators.required]],
      billingPeriod: ["", [Validators.required]],
      billingEmail: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
      billingSameEmail: [false, []],
    })
  }

  tabValid(tabIndex) {
    if (tabIndex === 0) {
      return this.bankForm['controls'].bankCode.invalid ||
        this.bankForm['controls'].bankName.invalid ||
        this.bankForm['controls'].bankURL.invalid ||
        this.bankForm['controls'].country.invalid ||
        this.bankForm['controls'].cardSchemes.invalid
    }
    if (tabIndex === 1) {
      if (this.bankForm['controls'].contactPreferredMethod.touched && this.bankForm['controls'].contactPreferredMethod.value != "1") {
        const checked = this.bankForm['controls'].contactNumber.invalid || this.bankForm['controls'].contactNumber.value.length < 1 ? "1" : "2"
        this.bankForm['controls'].contactPreferredMethod.setValue(checked)
      }
      return this.bankForm['controls'].contactName.invalid ||
        this.bankForm['controls'].contactEmail.invalid ||
        this.bankForm['controls'].contactNumber.invalid
    }
  }

  getBankCodeErrorMessage() {
    return this.bankForm.controls.bankCode.hasError('required') ? 'You must enter a value' :
      this.bankForm.controls.bankCode.hasError('minlength') ? 'Should be at least 3 characters' :
        this.bankForm.controls.bankCode.hasError('maxlength') ? 'Should be at most 10 characters' :
          '';
  }

  getBankNameErrorMessage() {
    return this.bankForm.controls.bankName.hasError('required') ? 'You must enter a value' :
      this.bankForm.controls.bankName.hasError('maxlength') ? 'Should be at most 50 characters' :
        '';
  }
  getBankURLErrorMessage() {
    return this.bankForm.controls.bankURL.hasError('required') ? 'You must enter a value' :
      this.bankForm.controls.bankURL.hasError('max') ? 'Should be at most 999' :
        this.bankForm.controls.bankURL.hasError('pattern') ? 'Invalid URL' :
          '';
  }
  getCountryErrorMessage() {
    return this.bankForm.controls.country.hasError('required') ? 'You must enter a value' : '';
  }
  getCardSchemesErrorMessage() {
    return this.bankForm.controls.cardSchemes.hasError('required') ? 'You must enter a value' : '';
  }

  getContactNameErrorMessage() {
    return this.bankForm.controls.contactName.hasError('required') ? 'You must enter a value' :
      this.bankForm.controls.contactName.hasError('maxLength') ? 'Should be at most 50' :
        '';
  }
  getContactEmailErrorMessage() {
    return this.bankForm.controls.contactEmail.hasError('required') ? 'You must enter a value' :
      this.bankForm.controls.contactEmail.hasError('max') ? 'Should be at most 100' :
        this.bankForm.controls.contactEmail.hasError('email') ? 'Invalid email' :
          '';
  }
  getContactNumberErrorMessage() {
    return this.bankForm.controls.contactNumber.hasError('pattern') ? 'Invalid phone number' :
      '';
  }

  getContactPreferredMethodErrorMessage() {
    return this.bankForm.controls.contactEmail.hasError('required') ? 'You must enter a value' : '';
  }

  getBillingStartDateErrorMessage() {
    return this.bankForm.controls.billingStartDate.hasError('required') ? 'You must enter a value' : '';
  }

  setValidCheck() {
    // if (this.bankForm['controls'].contactPreferredMethod.value != "1"){
    //   const checked = this.bankForm['controls'].contactNumber.invalid || this.bankForm['controls'].contactNumber.value.length<1?"1":"2"
    //   this.bankForm['controls'].contactPreferredMethod.setValue(checked)
    // }
  }

  checkBillingSameEmail(event) {
    this.bankForm['controls'].billingEmail.setValue(this.bankForm['controls'].contactEmail.value)
  }

  onChangeCardSchemes(event) {
    this.bankForm.controls.billingPeriod.setValue('')
    this.bankForm.controls.billingPeriod.reset('')
    this.bankForm.controls.billingPeriod.markAsUntouched()
  }

  save() {
    const bankData = {
      "bankCode": this.bankForm.value.bankCode,
      "bankName": this.bankForm.value.bankName,
      "bankURL": this.bankForm.value.bankURL,
      "​country": parseInt(this.bankForm.value.country),
      "cardSchemes": this.bankForm.value.cardSchemes.map(item => { return { 'id': parseInt(item) } }),
      "contact": {
        "name": this.bankForm.value.contactName,
        "email": this.bankForm.value.contactEmail,
        "mobile": this.bankForm.value.contactNumber,
        "preferredMethod": this.bankForm.value.contactPreferredMethod
      },
      "billing": {
        "startDate": this.bankForm.value.billingStartDate.format("DD/MM/YYYY"),
        "period": parseInt(this.bankForm.value.billingPeriod),
        "email": this.bankForm.value.contactEmail,
      }
    }

    if (this.newBank) {
      this.bankService.createBank(bankData).subscribe((result) => {
        this.router.navigate(['/banks']);
      }, (error: any) => {
        console.error('createBank', error);
        alert('Error')
      })
    } else {
      this.bankService.updateBank(bankData).subscribe((result) => {
        this.router.navigate(['/banks']);
      }, (error: any) => {
        console.error('updateBank', error);
        alert('Error')
      })
    }
  }
}