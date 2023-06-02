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
            accountQuery = 'SELECT  Id, Name, Industry, Phone, NumberOfEmployees, BillingCity, BillingState, Rating From Account';// LIMIT 2 OFFSET:offsetNumber';//\''+offset+'\'';
        }
        
        List<Account> lstAccs = Database.query(accountQuery);
        
        if(lstAccs.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return lstAccs; 
        
        
    }
    
}

//
//
//
//
//Retrieve list of account using Api
/*
HttpRequest req = new HttpRequest();
        req.setEndpoint('https://'+URL.getSalesforceBaseUrl().getHost()+'/services/data/v39.0/query/?q=SELECT+Id,Name,Type+FROM+Account');
        req.setMethod('GET');
        
        //Get SessionId
        string autho = 'Bearer '+userInfo.getSessionId();
        req.setHeader('Authorization', autho);
        
        //Get Response
        Http http = new Http();
        HTTPresponse res= http.send(req);
        string response = res.getBody();
        
        //Deserialize obtained json response
        string str = '['+ response.substring(response.indexOf('records":[')+10,response.indexof(']}')) +']';
        list<Account> acc = (list<Account>)JSON.deserialize(str,list<Account>.class);
        
        system.debug('acc-->'+acc.size());


*/