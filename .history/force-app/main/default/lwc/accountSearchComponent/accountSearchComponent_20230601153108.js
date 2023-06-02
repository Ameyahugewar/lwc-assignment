import { LightningElement, wire } from 'lwc';
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
        label: 'Industry',
        fieldName: 'Industry',
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
    }, {
        label: 'Type',
        fieldName: 'Type',
        type: 'text'
    },
];

export default class AccountSearchComponent extends LightningElement {

    searchData;
    columns = columns;
    errorMsg = '';
    strSearchAccName = '';
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
        this.strSearchAccName = event.currentTarget.value;
    }

    handlePhoneNumber(event) {
        this.errorMsg = '';
        this.phoneNumber = event.currentTarget.value;
    }

    handleState(event) {
        this.errorMsg = '';
        this.state = event.currentTarget.value;
    }

    handleCity(event) {
        this.errorMsg = '';
        this.city = event.currentTarget.value;
    }

    handleIndustry(event) {
        this.errorMsg = '';
        this.industry = event.currentTarget.value;
    }

    handleRating(event) {
        this.errorMsg = '';
        this.rating = event.currentTarget.value;
    }

    handleSearch() {
        if(!this.strSearchAccName) {
            this.errorMsg = 'Please enter account name to search.';
            this.searchData = undefined;
            return;
        }
        if(!this.phoneNumber) {
            this.errorMsg = 'Please enter Phone Number to search.';
            this.searchData = undefined;
            return;
        }

        serachAccs({searchKey : this.phoneNumber})
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