@IsTest 
public class AccountSearchController_Test {
    @IsTest
    Public static void validateGetAccounts() {
       Account accRecord = new Account(Name='Test Acc',Industry='Agriculture',Rating='Hot',BillingCountry='India',BillingCity='Nagpur',Phone='1234567890');
       insert accRecord;
       List<Account> accList=AccountSearchController.getAccounts('','Nagpur','Agriculture','Hot','Test Acc','1234567890');
       List<Account> accList2=AccountSearchController.getAccounts('','','','','','');
       
       System.assertEquals(1,accList.size());
    }
}