
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
        this.objDialog.is = true;
        this.objDialog.type = 'add';
        this.objDialog.data = '';
    },
    handleDialogEdit (item) {
        this.objDialog.is = true;
        this.objDialog.type = 'edit';
        this.objDialog.data = item;
    },
};

export default {
    data,
    methods,
}
