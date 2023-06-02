import { LightningElement, track, wire } from 'lwc';
import getAccountRecords from '@salesforce/apex/AccountSearchController.getAccounts';
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

    @track accountRecords;
    columns = columns;
    errorMsg = '';
    name = '';
    phoneNumber= '';
    value ='';
    state ='';
    city ='';
    industry ='';
    rating ='';

    //
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay;// = []; //Records to be displayed on the page

    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

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
    this.accountRecords=undefined;
    }

    handleSearch() {
        /*if(!this.name) {
            this.errorMsg = 'Please enter account name to search.';
            this.accountRecords = undefined;
            return;
        }
        if(!this.phoneNumber) {
            this.errorMsg = 'Please enter Phone Number to search.';
            this.accountRecords = undefined;
            return;
        }*/

        getAccountRecords({state : this.state,city : this.city,industry : this.industry,rating : this.rating,name : this.name,phone : this.phoneNumber})
        .then(result => {
            this.accountRecords = result;
            //
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
        })
        .catch(error => {
            this.accountRecords = undefined;
            if(error) {
                if (Array.isArray(error.body)) {
                    this.errorMsg = error.body.map(e => e.message).join(', ');
                } else if (typeof error.body.message === 'string') {
                    this.errorMsg = error.body.message;
                }
            }
        }) 
    }

    //
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.accountRecords[i]);
        }
    }

}