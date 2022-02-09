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
        //console.log(JSON.stringify(data))
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
}

$(() => {
    $(window).load(() => {
      App.init()
    });
});