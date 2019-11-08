
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
        if (this.beforeDialogShow) {
            this.beforeDialogShow().then(() => {
                this.objDialog.is = true;
                this.objDialog.type = 'add';
                this.objDialog.data = '';
            })
        } else {
            this.objDialog.is = true;
            this.objDialog.type = 'add';
            this.objDialog.data = '';
        }

    },
    handleDialogEdit (item) {
        if (this.beforeDialogShow) {
            this.beforeDialogShow().then(() => {
                this.objDialog.is = true;
                this.objDialog.type = 'edit';
                this.objDialog.data = item;
            })
        } else {
            this.objDialog.is = true;
            this.objDialog.type = 'edit';
            this.objDialog.data = item;
        }
    },

    handleDialogDisplay (options, key = 'objDialog') {
        this[key] = { is: true, ...this[key], ...options };
    },

};

export default {
    data,
    methods,
}
