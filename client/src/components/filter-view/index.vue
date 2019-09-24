<template>
    <div class="wrap">
        <div class="input-wrap">
            <template v-for="(item, key) in filterForm">
                <el-date-picker
                    v-if="item.mode === 'daterange'"
                    v-model="item.value"
                    type="daterange"
                    :size="item.size || 'small'"
                    :style="item.style"
                    class="filter-item"
                    :picker-options="item.options"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <el-input
                    v-if="item.mode === 'input'"
                    v-model="item.value"
                    :size="item.size || 'small'"
                    clearable
                    :maxlength="item.maxLength || 30"
                    :placeholder="item.placeholder"
                    :style="item.style"
                    class="filter-item"
                    @keyup.enter.native="handleEnter(item)"
                ></el-input>
                <el-select
                    v-if="item.mode === 'select'"
                    v-model="item.value"
                    :size="item.size || 'small'"
                    clearable
                    class="filter-item"
                    :placeholder="item.placeholder"
                    :style="item.style"
                    @change="handleTap(item)">
                    <el-option
                        v-for="option in item.options"
                        :key="option[item.valueKey || 'value']"
                        :label="option[item.labelKey || 'label']"
                        :value="option[item.valueKey|| 'value']"
                    ></el-option>
                </el-select>
            </template>
        </div>

        <el-button-group
            class="button-wrap">
            <el-button
                v-for="(item, key) in filterButton"
                :key="key"
                class="filter-item"
                :type="item.type"
                :loading="item.loading"
                :icon="item.icon"
                :style="item.style"
                :size="item.size || 'small'"
                @click="handleTap(item)">
                {{item.loading ? item.loadingText || item.text : item.text}}
            </el-button>
        </el-button-group>
    </div>
</template>

<script>

    export default {
        props: {
            filterForm: {
                default: {}
            },
            filterButton: {
                default: [],
            },
        },
        methods: {
            handleEnter (item) {
                let { event } = item;
                let button = this.getButtonByEvent(event) || {};
                button.loading = true;
                this.emitEvent(event, button);
            },
            handleTap (item) {
                let { event } = item;
                this.emitEvent(event, item);
            },
            emitEvent (event, item) {
                let type = typeof item.loading !== 'undefined';
                if (type) item.loading = true;
                this.$emit(event, () => {
                    if (type) item.loading = false
                });
            },
            getButtonByEvent (event) {
                for (let i = 0, len = this.buttonData.length; i < len; i++) {
                    let item = this.buttonData[i];
                    if (item.event === event) return item;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .wrap{
        @extend %df;
        @extend %aic;
        @extend %fww;
        @extend %jcs;
        padding: 10px 10px 0 10px;
        background-color: #fff;
        border-radius: 4px;
        font-size: 20px;
    }
    .filter-item{
        margin-bottom: 10px;
    }
</style>
