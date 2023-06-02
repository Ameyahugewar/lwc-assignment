public class AccountSearchController {
    @AuraEnabled(Cacheable = true)
    @ReadOnly
    @RemoteAction
    public static list<Account> getAccounts (String state,String city,String industry,String rating,String name,String phone){ 
        String accountQuery;
        
        String condition = (String.isNotBlank(state) ? 'BillingStateCode LIKE \'' + '%' + state + '%\'' : '');
        
        condition += (String.isNotBlank(city) ? (String.isNotBlank(condition) ? +' AND ' : '') +'BillingCity LIKE \'' 
                      + '%' + city +'%\'': '');
        
        condition += (String.isNotBlank(industry)
                      ? (String.isNotBlank(condition) 
                      ? +' AND ' : '') +' Industry LIKE \'' +'%' + industry +'%\'': '');
        
        condition += (String.isNotBlank(rating)
                      ? (String.isNotBlank(condition) 
                      ? +' AND ' : '') + ' Rating LIKE \'' + '%' + rating + '%\'' : '');
        
        condition += (String.isNotBlank(name)
                      ? (String.isNotBlank(condition) 
                      ? +' AND ' : '') +' Name LIKE \'' +'%' + name +'%\'' : '');
        
        condition += (String.isNotBlank(phone)
                      ? (String.isNotBlank(condition) 
                      ? +' AND ' : '') + ' Phone LIKE \'' + '%' + phone + '%\'': '');
        
        System.debug('condition ' + condition);
        if (String.isNotBlank(condition)) 
        {
            accountQuery = 'SELECT  Id, Name, Industry, Phone, NumberOfEmployees, BillingCity, BillingState, Rating From Account WHERE '+condition ;
        } else 
        {
            accountQuery = 'SELECT  Id, Name, Industry, Phone, NumberOfEmployees, BillingCity, BillingState, Rating From Account';
        }
        
        List<Account> lstAccs = Database.query(accountQuery);
        
        if(lstAccs.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return lstAccs; 
        
        
    }
    
}
