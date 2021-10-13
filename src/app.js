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
        const id = $('#StudentID').val()
        const dateOfBirth = Math.floor(new Date($('#DateOfBirth').val()).getTime()/1000)
        const prn = $('#PRN').val()
        const branch = $('#Branch').val()

        console.log(App.account)
        
        await App.Student.add_student_info(id, name, dateOfBirth, prn, branch, {from: App.account})
    },

    get_student_info: async () => {
        const id = $('#StudentID2').val()
        const data = await App.Student.get_student_info(id)
        console.log(JSON.stringify(data))
        var d = new Date(data['dateOfBirth']*1000)
        var date = ''.concat(d.getDate(),'-', d.getMonth()+1, '-', d.getUTCFullYear())

        if(date == "1-1-1970"){
            Swal.fire({
                title: 'Student Not Found',
                text: "Make sure you have entered the corrent UID",
                icon: 'error',
                confirmButtonText: 'Close'
            })
        }
        else{Swal.fire({
            title: 'Student Found',
            text: ''.concat('Name: ',data['name'], '\nDate of Birth: ', date , '\nPRN Number: ', data['prnNumber'], '\nBranch: ', data['branch']),
            icon: 'success',
            confirmButtonText: 'Close'
        })}
        
    }

}

$(() => {
    $(window).load(() => {
      App.init()
    });
});

