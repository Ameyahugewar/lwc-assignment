import { LightningElement, track, wire } from 'lwc';
import serachAccs from '@salesforce/apex/AccountSearchController.getAccounts';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import BILLINGSTATE_FIELD from '@salesforce/schema/Account.BillingStateCode';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name'
    }, {
        label: 'State',
        fieldName: 'BillingState',
    },{
        label: 'City',
        fieldName: 'BillingCity',
    },{
        label: 'Industry',
        fieldName: 'Industry',
    },{
        label: 'Rating',
        fieldName: 'Rating',
    },{
        label: 'Number of Employees',
        fieldName: 'NumberOfEmployees',
        type: 'text'
    },{
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
    },
];

export default class AccountSearchComponent extends LightningElement {

    @track searchData;
    columns = columns;
    errorMsg = '';
    name = '';
    phoneNumber= '';
    value ='';
    state ='';
    city ='';
    industry ='';
    rating ='';
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: INDUSTRY_FIELD
        }
    )
    industryPicklist;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: RATING_FIELD
        }
    )
    ratingPicklist;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: BILLINGSTATE_FIELD
        }
    )
    billingStatePicklist;
    

    handleAccountName(event) {
        this.errorMsg = '';
        this.name = event.currentTarget.value;
    }

    handlePhoneNumber(event) {
        this.errorMsg = '';
        this.phoneNumber = event.currentTarget.value;
    }

    handleState(event) {
        this.errorMsg = '';
        this.state = event.currentTarget.value;
        console.log('this.state'+this.state);
    }

    handleCity(event) {
        this.errorMsg = '';
        this.city = event.currentTarget.value;
        console.log('this.city'+this.city);
    }

    handleIndustry(event) {
        this.errorMsg = '';
        this.industry = event.currentTarget.value;
        console.log('this.industry'+this.industry);
    }

    handleRating(event) {
        this.errorMsg = '';
        this.rating = event.currentTarget.value;
        console.log('this.rating'+this.rating);
    }

    clearFilters(){
    this.state = '';
    this.city = '';
    this.industry = '';
    this.rating = '';
    this.name = '';
    this.phoneNumber = '';
    this.searchData=undefined;
    }

    handleSearch() {
        /*if(!this.name) {
            this.errorMsg = 'Please enter account name to search.';
            this.searchData = undefined;
            return;
        }
        if(!this.phoneNumber) {
            this.errorMsg = 'Please enter Phone Number to search.';
            this.searchData = undefined;
            return;
        }*/

        serachAccs({state : this.state,city : this.city,industry : this.industry,rating : this.rating,name : this.name,phone : this.phoneNumber})
        .then(result => {
            this.searchData = result;
        })
        .catch(error => {
            this.searchData = undefined;
            if(error) {
                if (Array.isArray(error.body)) {
                    this.errorMsg = error.body.map(e => e.message).join(', ');
                } else if (typeof error.body.message === 'string') {
                    this.errorMsg = error.body.message;
                }
            }
        }) 
    }
}