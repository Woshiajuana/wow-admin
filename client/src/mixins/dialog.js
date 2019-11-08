
const data = () => {
    return {
        objDialog: {
            is: false,
            type: 'add',
            data: '',
        },
    };
};

const methods = {
    handleDialogAdd () {


    },
    handleDialogEdit (item) {
       
    },

    handleDialogDisplay (options, key = 'objDialog') {
        this[key] = { ...this[key], is: true, ...(options || {}) };
    },

};

export default {
    data,
    methods,
}
