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
        // var d = new Date(data['dateOfBirth']*1000)
        // var date = ''.concat(d.getDate(),'-', d.getMonth()+1, '-', d.getUTCFullYear())

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
                text: 'Hi, '.concat(data['name']),
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
        // console.log(data)
        // console.log(result)

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
                text: 'It\'s safe on the chain!',
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
        // var d = new Date(data['dateOfBirth']*1000)
        // var date = ''.concat(d.getDate(),'-', d.getMonth()+1, '-', d.getUTCFullYear())

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
                text: 'We Found the Account!',
                icon: 'success',
                confirmButtonText: 'Download PDF'
            }).then(() => {
                data['hallticket']= id
                App.generate_pdf(data)   
            })
        }
    },
    generate_pdf: async (data) => {
        // https://github.com/openpgpjs/openpgpjs#encrypt-and-decrypt-string-data-with-pgp-keys                                                  
        (async function() {                                                                                                                      
        try{                                                                                                                                 
        // put keys in backtick (``) to avoid errors caused by spaces or tabs                                                            
        const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v2.1.15
Comment: https://keybase.io/crypto

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
ic1kYQiyU4NHWXeZpflmnIFirPGk2g==
=s6is
-----END PGP PRIVATE KEY BLOCK-----`;                                                                     
                                                                                                                                
        const message = JSON.stringify(data);                                                                                            
        const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });                                                       
        const unsignedMessage = await openpgp.createCleartextMessage({text: message});                                                                                                                          
        const cleartextMessage = await openpgp.sign({
            message: unsignedMessage, // CleartextMessage or Message object
            signingKeys: privateKey
        });
        // console.log(encrypted);                                                                                                          
        data['pgp'] = btoa(cleartextMessage);                                                                                                         
        window.open("templates/template.html?data="+btoa(JSON.stringify(data)));
        }                                                                                                                                    
        catch(e){                                                                                                                            
        console.log("error: ", e); 
        }
        })();
    },

    verify_signature: async () => {

        (async () => {
            try {
            const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v2.1.15
Comment: https://keybase.io/crypto

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
8aTa
=J1HM
-----END PGP PUBLIC KEY BLOCK-----`; // public key
                    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
                    const cleartextMessage = atob($('#signature').val());
                    const signedMessage = await openpgp.readCleartextMessage({
                        cleartextMessage // parse armored message
                    });
                    const verificationResult = await openpgp.verify({
                        message: signedMessage,
                        verificationKeys: publicKey
                    });
                    const { verified, keyID } = verificationResult.signatures[0];
                        await verified; // throws on invalid signature
                        Swal.fire({
                            title: 'Valid Signature',
                            text: "The data provided to you is legitimate",
                            icon: 'success',
                            confirmButtonText: 'Great!'
                        })
                    } catch (e) {
                        Swal.fire({
                            title: 'Invalid Signature',
                            text: "The data provided to you is illegitimate",
                            icon: 'error',
                            confirmButtonText: 'Okay'
                        })
                    }
        })();
    }
}

$(() => {
    $(window).load(() => {
      App.init()
    });
});