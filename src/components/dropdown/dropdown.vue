<template>
    <transition name="transition-drop">
        <div v-show="show" v-scroll="data" 
        :class="[`${prefixCls}`, `${prefixCls}-${size}`, !autoWidth && `${prefixCls}-inherit`]" 
        :style="boxStyle"
        >
            <div :class="`${prefixCls}-list`">
                <div v-for="(item, index) in data" :key="item.id || index" 
                    :class="[`${prefixCls}-item`, item.active && `${prefixCls}-active`, item.disabled && `${prefixCls}-disabled`, `theme-${theme}`]"
                    @click="!item.disabled && handleClick(item)" :title="showTitle && item.title">
                    <slot>{{item.value}}</slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import {hasParam} from '../../utils/util';
import scroll from '../../directives/scroll';
// import clickoutside from '../../directives/clickoutside';           //后续优化
const prefixCls = 'qui-dropdown';

export default {
    name: 'DropDown',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        maxLength: {
            type: Number,
            default: 5
        },
        size: {
            type: String,
            default: 'middle',    //设置高度
            validator (value) {
                const valueList = ['small', 'middle', 'large',];
                return hasParam(value, valueList);
            }
        },
        autoWidth: {
            type: Boolean,
            default: false
        },
        showTitle: {
            type: Boolean,
            default: false
        },
        transition: {
            type: String,
            default: 'fade-in-move-up'
        },
        show: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: 'default',
            validator (value) {
                const valueList = ['default', 'primary']
                return hasParam(value, valueList)
            }
        }
    },
    data () {
        return {
            prefixCls,
            isShow: this.show
        }
    },
    methods: {
        handleClick (item) {
            this.$emit('on-choose', item);
        },
        setMaxHeight (lineH = 32, mt = 8) {
            const { maxLength } = this;
            return maxLength * lineH + mt * (maxLength - 1) - 10;
        },
        setScrollData () {

        },
        handleClickOutSide () {

        }
    },
    watch: {
        // show (v) {
        //     if (v === this.isShow) return;
        //     this.isShow = v;
        // }
    },
    computed: {
        boxStyle () {
            const vm = this;
            let maxH;
            let size = vm.size;
            switch (size) {
                case 'small':
                    maxH = vm.setMaxHeight(26, 4);
                    break;
                case 'large':
                    maxH = vm.setMaxHeight(40, 12);            
                default:
                    maxH = vm.setMaxHeight();
                    break;
            }
            return {
                'max-height': maxH + 'px'
            }

        }
    },
    directives: { scroll }
}
</script>

<style lang="scss" type="text/scss">
    @import "../../styles/components/_dropdown.scss";
</style>