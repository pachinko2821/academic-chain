App = {
    loading: false,
    contracts: {},

    init: async () => {
        await App.initAccount()
        await App.initContract()
        await App.render()
    },

    //https://ethereum.stackexchange.com/questions/92095/web3-current-best-practice-to-connect-metamask-to-chrome/92097
    initAccount: async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                App.account = accounts[0]
            }
            catch (error) {
                if (error.code === 4001) {
                console.log(error)
                }
            }
        }
        else{
            Swal.fire({
                title: 'Browser is not Ethereum Enabled',
                text: 'Please Install Metamask extension for your browser',
                icon: 'info',
                confirmButtonText: 'Okay!'
            })
        }
    },

    initContract: async () => {
        const student = await $.getJSON('Student.json')
        App.contracts.Student = TruffleContract(student)
        App.contracts.Student.setProvider(window.ethereum)
        App.Student = await App.contracts.Student.deployed()
    },

    render: async () => {
        if(App.loading){
            return
        }
        
        App.setLoading(true)
        $('#account').html(App.account)
        App.setLoading(false)
    },

    setLoading: (boolean) => {
        App.loading = boolean
        
        var $loader = $('#loader')
        var $content = $('#content')
        
        if (App.loading) {
            $content.hide()
            $loader.show()
        }
        else {
            $content.show()
            $loader.hide()
        }
    },

    add_student_info: async () => {
        const name = $('#StudentName').val()
        const mothersName = $('#mothersName').val()
        const id = $('#StudentID').val()
        const dateOfBirth = Math.floor(new Date($('#DateOfBirth').val()).getTime()/1000)

        console.log(App.account)
        
        await App.Student.add_student_info(id, name, mothersName, dateOfBirth, {from: App.account})
    },

    get_student_info: async () => {
        const id = $('#StudentIDFetch').val()
        const enteredMothersName = $('#mothersNameFetch').val()

        const data = await App.Student.get_student_info(id)
        var d = new Date(data['dateOfBirth']*1000)
        var date = ''.concat(d.getDate(),'-', d.getMonth()+1, '-', d.getUTCFullYear())

        if(enteredMothersName != data['mothersName']){
            Swal.fire({
                title: 'Student Not Found',
                text: "Make sure you have entered the corrent UID and Mother's Name",
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
        else{
            Swal.fire({
                title: 'Student Found',
                text: ''.concat('Name: ',data['name'], '\nDate of Birth: ', date),
                icon: 'success',
                confirmButtonText: 'Close'
            })
        }
    },

    add_student_result: async () => {
        const mothersNameResult = $('#mothersNameResult').val()
        const id = $('#id').val()
        const sub1 = $('#Sub1').val()
        const sub2 = $('#Sub2').val()
        const sub3 = $('#Sub3').val()
        const sub4 = $('#Sub4').val()
        const sub5 = $('#Sub5').val()
        const sub6 = $('#Sub6').val()

        var result = {"Sub1":sub1, "Sub2":sub2, "Sub3":sub3, "Sub4":sub4, "Sub5":sub5, "Sub6":sub6}
        result = JSON.stringify(result)

        const data = await App.Student.get_student_info(id)
        console.log(data)
        console.log(result)

        if(data['name'] == ''){
            Swal.fire({
                title: 'Student Not Found',
                text: "Make sure you have entered the corrent UID and Mother's Name",
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
        else{
            const name = data['name']
            const dateOfBirth = data['dateOfBirth']

            console.log(App.account)
            
            await App.Student.add_student_result(id, name, mothersNameResult, dateOfBirth, result, {from: App.account})

            Swal.fire({
                title: 'Result Added Successfully',
                text: ''.concat('Name: ',data['name'], '\nDate of Birth: ', date),
                icon: 'success',
                confirmButtonText: 'Close'
            })
        }
    },

    get_student_result: async () => {
        const id = $('#StudentIDFetchResult').val()
        const enteredMothersName = $('#mothersNameFetchResult').val()

        const data = await App.Student.get_student_result(id)
        
        var result = JSON.parse(data['result'])
        var d = new Date(data['dateOfBirth']*1000)
        var date = ''.concat(d.getDate(),'-', d.getMonth()+1, '-', d.getUTCFullYear())

        if(enteredMothersName != data['mothersName']){
            Swal.fire({
                title: 'Student Not Found',
                text: "Make sure you have entered the corrent UID and Mother's Name",
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
        else{
            Swal.fire({
                title: 'Student Found',
                text: ''.concat('Name: ',data['name'], '\nDate of Birth: ', date, '\nResult: ', data['result']),
                icon: 'success',
                confirmButtonText: 'Download PDF'
            }).then(() => {
                App.generate_pdf(data)   
            })
        }
    },
    generate_pdf: async (data) => {
        // https://github.com/openpgpjs/openpgpjs#encrypt-and-decrypt-string-data-with-pgp-keys                                                  
        (async function() {                                                                                                                      
        try{                                                                                                                                 
        // put keys in backtick (``) to avoid errors caused by spaces or tabs                                                            
        const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.15
Comment: https://keybase.io/crypto

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
FZOa
=R2k5
-----END PGP PUBLIC KEY BLOCK-----`;
        //const privateKeyArmored = ``; // encrypted private key                                                                         
                                                                                                                                
        const message = JSON.stringify(data);                                                                                            
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });                                                       
        const encrypted = await openpgp.encrypt({                                                                                        
        message: await openpgp.createMessage({ text: message }), // input as Message object                                          
        encryptionKeys: publicKey,                                                                                                   
        });                                                                                                                              
        
        console.log(encrypted);                                                                                                          
        data['pgp'] = btoa(encrypted);                                                                                                         
        window.open("templates/template.html?data="+btoa(JSON.stringify(data)));

        }                                                                                                                                    
        catch(e){                                                                                                                            
        console.log("error: ", e); 
        }
        })();
    }
}

$(() => {
    $(window).load(() => {
      App.init()
    });
});