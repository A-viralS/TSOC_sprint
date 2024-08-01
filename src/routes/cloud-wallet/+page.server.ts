import NeucronSDK from "neucron-sdk";
/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ request }) => {
      const data = await request.formData();

      const neucron = new NeucronSDK();

      const authModule = neucron.authentication;
      const walletModule = neucron.wallet;

      const loginResponse = await authModule.login({
        email: data.get('email'),
        password: data.get('password'),
      });
      console.log(loginResponse);

      const DefaultWalletBalance = await walletModule.getWalletBalance({});
      console.log(DefaultWalletBalance);

      return { success: true, balance: DefaultWalletBalance.data.balance.summary };
    },
    pay: async ({ request }) => {
      const data = await request.formData();

      const neucron = new NeucronSDK();

      const authModule = neucron.authentication;

      const loginResponse = await authModule.login({
        email: data.get('email'),
        password: data.get('password'),
      });
      console.log(loginResponse);

      const options = {
        outputs: [
          {
            address: data.get('paymail'),
            note: 'gurudakshina',
            amount: Number(data.get('amount')),
          },
        ],
      };
      console.log(options);
      const payResponse = await neucron.pay.txSpend(options);
      console.log(payResponse);

      return { success: true, payment: payResponse.data.txid };
    },
    uploadFile: async ({ request }) => {
        const neucron = new NeucronSDK();
        const authModule = neucron.authentication;
      
        // Get form data
        const data = await request.formData();
      
        // Login
        const loginResponse = await authModule.login({
          email: data.get('email'),
          password: data.get('password'),
        });
        console.log(loginResponse);
      
        // Get the file from form data
        const file = data.get('file');
        if (file && file instanceof File) {
          try {
            // Create a Blob object from the File
            const blob = new Blob([file], { type: file.type });
      console.log(file.name);
      const name=file.type
            // Create a form data object to send the file as a binary
            const formData = new FormData();
            formData.append('file', blob, file.name);
            console.log('formdata',formData);
            
      
            // Convert form data to a format the SDK expects (if necessary)
            const uploadResponse = await neucron.dataIntegrity.uploadFile({ filePath: '/Users/aviralsoni/Documents/Aviral Soni_Arc.png' });
            console.log(uploadResponse);
      
            // Return success and the transaction ID
            return { success: true, txid: uploadResponse.data.txid };
          } catch (error) {
            console.error('File upload failed:', error);
            return { success: false, error: 'File upload failed' };
          }
        }
     
      }
      
  };